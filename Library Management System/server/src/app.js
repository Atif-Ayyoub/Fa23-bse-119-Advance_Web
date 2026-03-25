import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Root helper route to make visiting the server root useful during local development
app.get('/', (req, res) => {
	res.json({ message: 'Library Management System API - see /api', routes: ['/api/health'] });
});

app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
