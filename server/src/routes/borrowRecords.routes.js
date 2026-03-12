import { Router } from 'express';
import {
  createBorrowRecord,
  deleteBorrowRecord,
  getBorrowRecordById,
  listBorrowRecords,
  updateBorrowRecord,
} from '../controllers/borrowRecords.controller.js';

const borrowRecordsRouter = Router();

borrowRecordsRouter.get('/', listBorrowRecords);
borrowRecordsRouter.get('/:recordId', getBorrowRecordById);
borrowRecordsRouter.post('/', createBorrowRecord);
borrowRecordsRouter.put('/:recordId', updateBorrowRecord);
borrowRecordsRouter.delete('/:recordId', deleteBorrowRecord);

export default borrowRecordsRouter;
