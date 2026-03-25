import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import { Book } from '../models/book.model.js';
import { BorrowRecord } from '../models/borrowRecord.model.js';

const normalize = (value = '') => String(value).trim().toLowerCase();

const chooseKeepId = (documents) => {
  const sorted = [...documents].sort((left, right) => {
    const leftRating = Number(left.rating || 0);
    const rightRating = Number(right.rating || 0);

    if (rightRating !== leftRating) {
      return rightRating - leftRating;
    }

    const leftCreated = new Date(left.createdAt || 0).getTime();
    const rightCreated = new Date(right.createdAt || 0).getTime();
    return rightCreated - leftCreated;
  });

  return sorted[0]?._id;
};

const dedupeBooks = async () => {
  await connectDb();

  const books = await Book.find({}).select('_id title author rating createdAt').lean();
  const groups = new Map();

  for (const book of books) {
    const key = `${normalize(book.title)}::${normalize(book.author)}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(book);
  }

  let duplicateGroups = 0;
  let removedBooks = 0;

  for (const [, groupBooks] of groups) {
    if (groupBooks.length <= 1) {
      continue;
    }

    duplicateGroups += 1;

    const keepId = chooseKeepId(groupBooks);
    const removeIds = groupBooks.filter((book) => String(book._id) !== String(keepId)).map((book) => book._id);

    if (removeIds.length === 0) {
      continue;
    }

    await BorrowRecord.updateMany({ bookId: { $in: removeIds } }, { $set: { bookId: keepId } });
    const deleteResult = await Book.deleteMany({ _id: { $in: removeIds } });
    removedBooks += deleteResult.deletedCount || 0;
  }

  const totalBooks = await Book.countDocuments();

  console.log(`Duplicate groups resolved: ${duplicateGroups}`);
  console.log(`Books removed: ${removedBooks}`);
  console.log(`Total books after dedupe: ${totalBooks}`);

  await mongoose.connection.close();
};

dedupeBooks()
  .then(() => {
    console.log('Book deduplication completed successfully');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Book deduplication failed:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  });
