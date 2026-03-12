import 'dotenv/config';
import app from '../src/app.js';
import { connectDb } from '../src/config/db.js';

let hasConnected = false;

export default async function handler(req, res) {
  if (!hasConnected) {
    await connectDb();
    hasConnected = true;
  }

  return app(req, res);
}
