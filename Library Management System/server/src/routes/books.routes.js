import { Router } from 'express';
import {
  createBook,
  deleteBook,
  getBookById,
  getRecommendedBooks,
  listBookBorrowRecords,
  listBooks,
  updateBook,
} from '../controllers/books.controller.js';

const booksRouter = Router();

booksRouter.get('/', listBooks);
booksRouter.get('/:bookId/recommendations', getRecommendedBooks);
booksRouter.get('/:bookId', getBookById);
booksRouter.post('/', createBook);
booksRouter.put('/:bookId', updateBook);
booksRouter.delete('/:bookId', deleteBook);
booksRouter.get('/:bookId/borrow-records', listBookBorrowRecords);

export default booksRouter;
