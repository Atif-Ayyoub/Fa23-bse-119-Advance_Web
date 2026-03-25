import { Book } from '../models/book.model.js';
import { BorrowRecord } from '../models/borrowRecord.model.js';

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const STOP_WORDS = new Set(['the', 'and', 'for', 'with', 'from', 'into', 'this', 'that', 'your', 'book']);
const recommendationCache = new Map();
const RECOMMENDATION_TTL_MS = 5 * 60 * 1000;
const MAX_RECOMMENDATIONS = 10;
const MIN_RECOMMENDATIONS = 6;

const buildDuplicateFilter = (title, author) => ({
  title: { $regex: `^${escapeRegex(title)}$`, $options: 'i' },
  author: { $regex: `^${escapeRegex(author)}$`, $options: 'i' },
});

const clearRecommendationCache = () => {
  recommendationCache.clear();
};

const tokenize = (value = '') =>
  String(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));

const buildTitleKeywordRegexFilters = (titleText) => {
  const tokens = [...new Set(tokenize(titleText))].slice(0, 6);
  return tokens.map((token) => ({ title: { $regex: escapeRegex(token), $options: 'i' } }));
};

const buildCategoryRegexFilters = (categoryText) => {
  const tokens = [...new Set(tokenize(categoryText))].slice(0, 4);
  return tokens.map((token) => ({ category: { $regex: escapeRegex(token), $options: 'i' } }));
};

const scoreRecommendation = (targetBook, candidateBook) => {
  let score = 0;

  const sameCategory =
    String(targetBook.category || '').trim().toLowerCase() === String(candidateBook.category || '').trim().toLowerCase();
  const sameAuthor =
    String(targetBook.author || '').trim().toLowerCase() === String(candidateBook.author || '').trim().toLowerCase();

  if (sameCategory) {
    score += 120;
  }

  if (sameAuthor) {
    score += 90;
  }

  const candidateTitle = String(candidateBook.title || '').toLowerCase();
  const candidateCategory = String(candidateBook.category || '').toLowerCase();
  const titleTokens = [...new Set(tokenize(targetBook.title))];

  for (const token of titleTokens) {
    if (candidateTitle.includes(token)) {
      score += 15;
    }
    if (candidateCategory.includes(token)) {
      score += 8;
    }
  }

  score += Math.round(Number(candidateBook.rating || 0) * 2);
  return score;
};

const getPopularFallback = async (excludeIds = []) => {
  const popularAggregation = await BorrowRecord.aggregate([
    { $group: { _id: '$bookId', borrowCount: { $sum: 1 } } },
    { $sort: { borrowCount: -1 } },
    { $limit: 20 },
  ]);

  const popularBookIds = popularAggregation.map((item) => item._id).filter(Boolean);
  if (popularBookIds.length === 0) {
    return [];
  }

  return Book.find({
    _id: { $in: popularBookIds, $nin: excludeIds },
  })
    .sort({ rating: -1, createdAt: -1 })
    .limit(20)
    .lean();
};

const getRecentFallback = async (excludeIds = []) =>
  Book.find({
    _id: { $nin: excludeIds },
  })
    .sort({ createdAt: -1, rating: -1 })
    .limit(20)
    .lean();

export const listBooks = async (req, res) => {
  const { query } = req.query;
  const limit = Number.parseInt(String(req.query.limit || ''), 10);
  const hasValidLimit = Number.isFinite(limit) && limit > 0;
  const normalizedLimit = hasValidLimit ? Math.min(limit, 100) : null;
  const compact = String(req.query.compact || '').toLowerCase() === 'true';
  const availableOnly = String(req.query.availableOnly || '').toLowerCase() === 'true';

  const filter = query
    ? {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ],
      }
    : {};

  if (availableOnly) {
    filter.availableCopies = { $gt: 0 };
  }

  let queryBuilder = Book.find(filter).sort({ createdAt: -1 });

  if (compact) {
    queryBuilder = queryBuilder.select('title author category availableCopies coverImage rating');
  }

  if (normalizedLimit) {
    queryBuilder = queryBuilder.limit(normalizedLimit);
  }

  const books = await queryBuilder;
  res.json(books);
};

export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
};

export const createBook = async (req, res) => {
  const title = String(req.body?.title || '').trim();
  const author = String(req.body?.author || '').trim();

  if (title && author) {
    const duplicate = await Book.findOne(buildDuplicateFilter(title, author));
    if (duplicate) {
      return res.status(409).json({ message: 'A book with the same title and author already exists.' });
    }
  }

  const createdBook = await Book.create(req.body);
  clearRecommendationCache();
  res.status(201).json(createdBook);
};

export const updateBook = async (req, res) => {
  const title = String(req.body?.title || '').trim();
  const author = String(req.body?.author || '').trim();

  if (title && author) {
    const duplicate = await Book.findOne({
      ...buildDuplicateFilter(title, author),
      _id: { $ne: req.params.bookId },
    });

    if (duplicate) {
      return res.status(409).json({ message: 'A book with the same title and author already exists.' });
    }
  }

  const updatedBook = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBook) {
    return res.status(404).json({ message: 'Book not found' });
  }

  clearRecommendationCache();
  res.json(updatedBook);
};

export const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  await BorrowRecord.deleteMany({ bookId: book._id });
  await book.deleteOne();

  clearRecommendationCache();
  res.status(204).send();
};

export const getRecommendedBooks = async (req, res) => {
  const { bookId } = req.params;

  const cached = recommendationCache.get(bookId);
  const now = Date.now();
  if (cached && now - cached.cachedAt < RECOMMENDATION_TTL_MS) {
    return res.json(cached.data);
  }

  const selectedBook = await Book.findById(bookId).lean();
  if (!selectedBook) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const orFilters = [
    { category: { $regex: `^${escapeRegex(String(selectedBook.category || ''))}$`, $options: 'i' } },
    { author: { $regex: `^${escapeRegex(String(selectedBook.author || ''))}$`, $options: 'i' } },
    ...buildTitleKeywordRegexFilters(selectedBook.title),
    ...buildCategoryRegexFilters(selectedBook.category),
  ].filter((item) => {
    const serialized = JSON.stringify(item);
    return !serialized.includes('"$regex":"^$"');
  });

  const candidates = await Book.find({
    _id: { $ne: selectedBook._id },
    $or: orFilters.length > 0 ? orFilters : [{ category: { $exists: true } }],
  })
    .limit(400)
    .lean();

  const scoredCandidates = candidates
    .map((candidate) => ({
      ...candidate,
      _recommendationScore: scoreRecommendation(selectedBook, candidate),
    }))
    .sort((left, right) => {
      if (right._recommendationScore !== left._recommendationScore) {
        return right._recommendationScore - left._recommendationScore;
      }

      const leftRating = Number(left.rating || 0);
      const rightRating = Number(right.rating || 0);
      if (rightRating !== leftRating) {
        return rightRating - leftRating;
      }

      return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
    });

  const dedupedRecommendations = [];
  const seenIdentity = new Set();

  for (const candidate of scoredCandidates) {
    const identity = `${String(candidate.title || '').trim().toLowerCase()}::${String(candidate.author || '').trim().toLowerCase()}`;
    if (seenIdentity.has(identity)) {
      continue;
    }

    seenIdentity.add(identity);
    dedupedRecommendations.push(candidate);

    if (dedupedRecommendations.length >= MAX_RECOMMENDATIONS) {
      break;
    }
  }

  const excludedIds = [selectedBook._id, ...dedupedRecommendations.map((item) => item._id)];

  if (dedupedRecommendations.length < MIN_RECOMMENDATIONS) {
    const popularFallback = await getPopularFallback(excludedIds);
    for (const candidate of popularFallback) {
      const identity = `${String(candidate.title || '').trim().toLowerCase()}::${String(candidate.author || '').trim().toLowerCase()}`;
      if (seenIdentity.has(identity)) {
        continue;
      }
      seenIdentity.add(identity);
      dedupedRecommendations.push(candidate);
      excludedIds.push(candidate._id);
      if (dedupedRecommendations.length >= MAX_RECOMMENDATIONS) {
        break;
      }
    }
  }

  if (dedupedRecommendations.length < MIN_RECOMMENDATIONS) {
    const recentFallback = await getRecentFallback(excludedIds);
    for (const candidate of recentFallback) {
      const identity = `${String(candidate.title || '').trim().toLowerCase()}::${String(candidate.author || '').trim().toLowerCase()}`;
      if (seenIdentity.has(identity)) {
        continue;
      }
      seenIdentity.add(identity);
      dedupedRecommendations.push(candidate);
      if (dedupedRecommendations.length >= MAX_RECOMMENDATIONS) {
        break;
      }
    }
  }

  const payload = dedupedRecommendations.slice(0, MAX_RECOMMENDATIONS).map(({ _recommendationScore, ...book }) => book);
  recommendationCache.set(bookId, { data: payload, cachedAt: now });

  res.json(payload);
};

export const listBookBorrowRecords = async (req, res) => {
  const records = await BorrowRecord.find({ bookId: req.params.bookId })
    .populate('memberId', 'fullName membershipId')
    .populate('bookId', 'title isbn')
    .sort({ createdAt: -1 });

  res.json(records);
};
