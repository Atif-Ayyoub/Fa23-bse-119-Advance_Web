import { Member } from '../models/member.model.js';
import { BorrowRecord } from '../models/borrowRecord.model.js';

export const listMembers = async (req, res) => {
  const members = await Member.find().sort({ createdAt: -1 });
  res.json(members);
};

export const getMemberById = async (req, res) => {
  const member = await Member.findById(req.params.memberId);
  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }
  res.json(member);
};

export const createMember = async (req, res) => {
  const createdMember = await Member.create(req.body);
  res.status(201).json(createdMember);
};

export const updateMember = async (req, res) => {
  const updatedMember = await Member.findByIdAndUpdate(req.params.memberId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedMember) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.json(updatedMember);
};

export const deleteMember = async (req, res) => {
  const member = await Member.findById(req.params.memberId);
  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  await BorrowRecord.deleteMany({ memberId: member._id });
  await member.deleteOne();

  res.status(204).send();
};

export const listMemberBorrowedBooks = async (req, res) => {
  const records = await BorrowRecord.find({ memberId: req.params.memberId, status: 'borrowed' })
    .populate('bookId', 'title author isbn category')
    .sort({ createdAt: -1 });

  const books = records.map((record) => ({
    recordId: record._id,
    borrowDate: record.borrowDate,
    dueDate: record.dueDate,
    status: record.status,
    book: record.bookId,
  }));

  res.json(books);
};

export const listMemberBorrowRecords = async (req, res) => {
  const records = await BorrowRecord.find({ memberId: req.params.memberId })
    .populate('memberId', 'fullName membershipId')
    .populate('bookId', 'title author isbn')
    .sort({ createdAt: -1 });

  res.json(records);
};
