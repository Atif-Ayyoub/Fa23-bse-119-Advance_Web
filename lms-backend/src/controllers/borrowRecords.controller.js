import { Book } from '../models/book.model.js';
import { BorrowRecord } from '../models/borrowRecord.model.js';
import { Member } from '../models/member.model.js';

const toStatus = (value) => (value || '').toString().toLowerCase();

export const listBorrowRecords = async (req, res) => {
  const records = await BorrowRecord.find()
    .populate('memberId', 'fullName membershipId')
    .populate('bookId', 'title author isbn')
    .sort({ createdAt: -1 });

  res.json(records);
};

export const getBorrowRecordById = async (req, res) => {
  const record = await BorrowRecord.findById(req.params.recordId)
    .populate('memberId', 'fullName membershipId email')
    .populate('bookId', 'title author isbn availableCopies');

  if (!record) {
    return res.status(404).json({ message: 'Borrow record not found' });
  }

  res.json(record);
};

export const createBorrowRecord = async (req, res) => {
  const { memberId, bookId, borrowDate, dueDate } = req.body;

  const [member, book] = await Promise.all([
    Member.findById(memberId),
    Book.findById(bookId),
  ]);

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (book.availableCopies <= 0) {
    return res.status(400).json({ message: 'No available copies for this book' });
  }

  book.availableCopies -= 1;
  await book.save();

  const record = await BorrowRecord.create({
    memberId,
    bookId,
    borrowDate,
    dueDate,
    status: 'borrowed',
  });

  const populatedRecord = await BorrowRecord.findById(record._id)
    .populate('memberId', 'fullName membershipId')
    .populate('bookId', 'title author isbn');

  res.status(201).json(populatedRecord);
};

export const updateBorrowRecord = async (req, res) => {
  const record = await BorrowRecord.findById(req.params.recordId);
  if (!record) {
    return res.status(404).json({ message: 'Borrow record not found' });
  }

  const currentStatus = toStatus(record.status);
  const nextStatus = toStatus(req.body.status || record.status);
  const returningNow = currentStatus === 'borrowed' && nextStatus === 'returned';

  if (returningNow) {
    const book = await Book.findById(record.bookId);
    if (book) {
      book.availableCopies += 1;
      if (book.availableCopies > book.totalCopies) {
        book.availableCopies = book.totalCopies;
      }
      await book.save();
    }
  }

  record.borrowDate = req.body.borrowDate ?? record.borrowDate;
  record.dueDate = req.body.dueDate ?? record.dueDate;
  record.returnDate = nextStatus === 'returned' ? req.body.returnDate || new Date() : null;
  record.status = nextStatus || record.status;

  await record.save();

  const populatedRecord = await BorrowRecord.findById(record._id)
    .populate('memberId', 'fullName membershipId')
    .populate('bookId', 'title author isbn');

  res.json(populatedRecord);
};

export const deleteBorrowRecord = async (req, res) => {
  const record = await BorrowRecord.findById(req.params.recordId);
  if (!record) {
    return res.status(404).json({ message: 'Borrow record not found' });
  }

  if (record.status === 'borrowed') {
    const book = await Book.findById(record.bookId);
    if (book) {
      book.availableCopies += 1;
      if (book.availableCopies > book.totalCopies) {
        book.availableCopies = book.totalCopies;
      }
      await book.save();
    }
  }

  await record.deleteOne();
  res.status(204).send();
};
