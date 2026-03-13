import 'dotenv/config';
import { connectDb } from '../config/db.js';
import { Book } from '../models/book.model.js';
import { BorrowRecord } from '../models/borrowRecord.model.js';
import { Member } from '../models/member.model.js';

const seed = async () => {
  await connectDb();

  await Promise.all([Book.deleteMany({}), Member.deleteMany({}), BorrowRecord.deleteMany({})]);

  const [bookOne] = await Book.create([
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      category: 'Software Engineering',
      publicationYear: 2008,
      totalCopies: 5,
      availableCopies: 5,
      shelfLocation: 'A-12',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41SH-SvWPxL._SX374_BO1,204,203,200_.jpg',
    },
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '9780262046305',
      category: 'Computer Science',
      publicationYear: 2022,
      totalCopies: 3,
      availableCopies: 3,
      shelfLocation: 'B-07',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780262046305-L.jpg',
    },
  ]);

  const [memberOne] = await Member.create([
    {
      fullName: 'Ayesha Khan',
      email: 'ayesha.khan@example.com',
      phone: '+92-300-1234567',
      membershipId: 'MEM-1001',
      address: 'Block A, College Road, Lahore',
      dateJoined: new Date('2025-09-01'),
      status: 'active',
    },
  ]);

  await BorrowRecord.create({
    memberId: memberOne._id,
    bookId: bookOne._id,
    borrowDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'borrowed',
  });

  bookOne.availableCopies -= 1;
  await bookOne.save();

  console.log('Seed data inserted successfully');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
