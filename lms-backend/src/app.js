import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
