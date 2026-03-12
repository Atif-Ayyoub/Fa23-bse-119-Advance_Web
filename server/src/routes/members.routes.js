import { Router } from 'express';
import {
  createMember,
  deleteMember,
  getMemberById,
  listMemberBorrowedBooks,
  listMemberBorrowRecords,
  listMembers,
  updateMember,
} from '../controllers/members.controller.js';

const membersRouter = Router();

membersRouter.get('/', listMembers);
membersRouter.get('/:memberId', getMemberById);
membersRouter.post('/', createMember);
membersRouter.put('/:memberId', updateMember);
membersRouter.delete('/:memberId', deleteMember);
membersRouter.get('/:memberId/borrowed-books', listMemberBorrowedBooks);
membersRouter.get('/:memberId/borrow-records', listMemberBorrowRecords);

export default membersRouter;
