import { Book } from '../models/book.model.js';
import { BorrowRecord } from '../models/borrowRecord.model.js';

export const listBooks = async (req, res) => {
  const { query } = req.query;
  const filter = query
    ? {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ],
      }
    : {};

  const books = await Book.find(filter).sort({ createdAt: -1 });
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
  const createdBook = await Book.create(req.body);
  res.status(201).json(createdBook);
};

export const updateBook = async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBook) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(updatedBook);
};

export const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  await BorrowRecord.deleteMany({ bookId: book._id });
  await book.deleteOne();

  res.status(204).send();
};

export const listBookBorrowRecords = async (req, res) => {
  const records = await BorrowRecord.find({ bookId: req.params.bookId })
    .populate('memberId', 'fullName membershipId')
    .populate('bookId', 'title isbn')
    .sort({ createdAt: -1 });

  res.json(records);
};
