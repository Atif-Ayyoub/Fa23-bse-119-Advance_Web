import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse';
import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import { Book } from '../models/book.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFileName = (process.env.CSV_FILE || 'book.csv').toString().trim();
const csvPath = path.resolve(__dirname, `../../../public/${csvFileName}`);
const BATCH_SIZE = 500;

const normalizeYear = (yearText) => {
  const parsed = Number.parseInt(String(yearText ?? '').replace('.0', ''), 10);
  if (Number.isFinite(parsed) && parsed >= 1000 && parsed <= 3000) {
    return parsed;
  }
  return 2000;
};

const normalizeRating = (ratingText) => {
  const parsed = Number.parseFloat(String(ratingText ?? '').trim());
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  if (parsed < 0) {
    return 0;
  }

  if (parsed > 5) {
    return 5;
  }

  return Number(parsed.toFixed(1));
};

const IMPORT_PREFIX = (process.env.IMPORT_PREFIX || 'KAGGLE').toString();

const mapRowToBook = (row, rowIndex) => {
  const title = String(row.title || '').trim();
  const author = String(row.authors || row.author || '').trim();
  const sourceBookId = String(row.book_id || row.bookId || row.isbn || '').trim();

  if (!title || !author || !sourceBookId) {
    return null;
  }

  const languageCode = String(row.language_code || row.language || '').trim();
  const publicationSource = row.original_publication_year || row.firstPublishDate || row.publishDate;
  const locationNumber = String((rowIndex % 800) + 1).padStart(3, '0');

  return {
    title,
    author,
    isbn: `${IMPORT_PREFIX}-${sourceBookId}`,
    category: languageCode ? `Language: ${languageCode}` : 'General',
    publicationYear: normalizeYear(publicationSource),
    totalCopies: 10,
    availableCopies: 10,
    shelfLocation: `R-${locationNumber}`,
    coverImage: String(row.image_url || row.coverImg || '').trim(),
    rating: normalizeRating(row.average_rating || row.rating),
    source: IMPORT_PREFIX,
  };
};

const buildBookIdentity = (title, author) => `${String(title || '').trim().toLowerCase()}::${String(author || '').trim().toLowerCase()}`;

const importBooksFromCsv = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in environment variables.');
  }

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  await connectDb();

  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
      bom: true,
      trim: true,
    })
  );

  let totalRows = 0;
  let validRows = 0;
  let upsertedCount = 0;
  let modifiedCount = 0;
  let batch = [];
  const seenIdentityKeys = new Set();

  for await (const row of parser) {
    totalRows += 1;
    const mapped = mapRowToBook(row, totalRows);

    if (!mapped) {
      continue;
    }

    const identityKey = buildBookIdentity(mapped.title, mapped.author);
    if (seenIdentityKeys.has(identityKey)) {
      continue;
    }

    seenIdentityKeys.add(identityKey);

    const { isbn, source, ...updatableFields } = mapped;

    validRows += 1;
    batch.push({
      updateOne: {
        filter: {
          title: mapped.title,
          author: mapped.author,
        },
        update: {
          $set: updatableFields,
          $setOnInsert: {
            isbn,
            source,
          },
        },
        upsert: true,
      },
    });

    if (batch.length >= BATCH_SIZE) {
      const result = await Book.bulkWrite(batch, { ordered: false });
      upsertedCount += result.upsertedCount || 0;
      modifiedCount += result.modifiedCount || 0;
      batch = [];
    }
  }

  if (batch.length > 0) {
    const result = await Book.bulkWrite(batch, { ordered: false });
    upsertedCount += result.upsertedCount || 0;
    modifiedCount += result.modifiedCount || 0;
  }

  const totalBooks = await Book.countDocuments();

  console.log(`CSV rows read: ${totalRows}`);
  console.log(`Valid rows processed: ${validRows}`);
  console.log(`Books inserted: ${upsertedCount}`);
  console.log(`Books updated: ${modifiedCount}`);
  console.log(`Total books in collection: ${totalBooks}`);

  await mongoose.connection.close();
};

importBooksFromCsv()
  .then(() => {
    console.log('Books CSV import completed successfully');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Books CSV import failed:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  });
