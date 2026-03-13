import 'dotenv/config';
import { connectDb } from './config/db.js';
import app from './app.js';

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDb();

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
