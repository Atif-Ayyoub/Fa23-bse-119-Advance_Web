import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard.jsx';
import { api, extractErrorMessage } from '../services/api.js';

function DashboardPage() {
  const [stats, setStats] = useState({ books: 0, members: 0, activeBorrows: 0, totalCopies: 0 });
  const [recentBooks, setRecentBooks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksResponse, membersResponse, recordsResponse] = await Promise.all([
          api.get('/books'),
          api.get('/members'),
          api.get('/borrow-records'),
        ]);

        const books = booksResponse.data;
        const members = membersResponse.data;
        const borrowRecords = recordsResponse.data;

        const totalCopies = books.reduce((sum, book) => sum + Number(book.totalCopies || 0), 0);
        const activeBorrows = borrowRecords.filter((record) => record.status === 'borrowed').length;

        setStats({
          books: books.length,
          members: members.length,
          activeBorrows,
          totalCopies,
        });
        setRecentBooks(books.slice(0, 4));
      } catch (requestError) {
        setError(extractErrorMessage(requestError, 'Failed to load dashboard'));
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="section-title mb-1">Library Dashboard</h2>
          <p className="text-muted-soft mb-0">Manage books, members, and borrowing workflows efficiently.</p>
        </div>
        <Link to="/borrow-records" className="btn btn-info glow-btn">
          Manage Borrowing
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <StatCard title="Total Books" value={stats.books} colorClass="text-info" />
        <StatCard title="Members" value={stats.members} colorClass="text-primary" />
        <StatCard title="Active Borrows" value={stats.activeBorrows} colorClass="text-warning" />
        <StatCard title="Total Copies" value={stats.totalCopies} colorClass="text-success" />
      </div>

      <div className="surface-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Recently Added Books</h5>
          <Link className="btn btn-sm btn-outline-info" to="/books">
            View all
          </Link>
        </div>

        <div className="row g-3">
          {recentBooks.length === 0 && <p className="text-muted-soft mb-0">No books available yet.</p>}
          {recentBooks.map((book) => (
            <div key={book._id} className="col-12 col-md-6 col-lg-3">
              <div className="p-3 rounded-3 border border-secondary-subtle h-100">
                <h6 className="mb-1">{book.title}</h6>
                <p className="text-muted-soft mb-1">{book.author}</p>
                <span className="badge text-bg-dark">{book.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
