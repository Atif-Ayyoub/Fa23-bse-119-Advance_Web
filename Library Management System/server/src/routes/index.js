import { Router } from 'express';
import booksRouter from './books.routes.js';
import borrowRecordsRouter from './borrowRecords.routes.js';
import membersRouter from './members.routes.js';

const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

apiRouter.use('/books', booksRouter);
apiRouter.use('/members', membersRouter);
apiRouter.use('/borrow-records', borrowRecordsRouter);

export default apiRouter;
