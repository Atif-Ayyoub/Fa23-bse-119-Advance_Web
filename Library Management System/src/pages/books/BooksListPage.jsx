import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, extractErrorMessage } from '../../services/api.js';

const fallbackCoverImage = 'https://placehold.co/300x400/11182D/E5ECF4?text=No+Cover';

const getHighQualityCoverImage = (url) => {
  if (!url) {
    return fallbackCoverImage;
  }

  if (url.includes('images.gr-assets.com/books/')) {
    return url.replace(/(\/books\/\d+)([ms])(?=\/)/i, '$1l');
  }

  return url;
};

function BooksListPage() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBooks = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/books', { params: search ? { query: search } : {} });
      setBooks(response.data);
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Failed to load books'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const summary = useMemo(
    () => ({ total: books.length, available: books.filter((book) => book.availableCopies > 0).length }),
    [books]
  );

  const handleDelete = async (bookId) => {
    if (!window.confirm('Delete this book?')) {
      return;
    }

    try {
      await api.delete(`/books/${bookId}`);
      await loadBooks(query);
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Failed to delete book'));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="section-title mb-1">Books</h2>
          <p className="text-muted-soft mb-0">
            Total: {summary.total} | Available: {summary.available}
          </p>
        </div>
        <Link to="/books/new" className="btn btn-success glow-btn">
          Add Book
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="surface-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-8">
            <input
              className="form-control"
              placeholder="Search by title, author, or category"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-12 col-md-4 d-flex gap-2">
            <button type="button" className="btn btn-info w-100" onClick={() => loadBooks(query)}>
              Search
            </button>
            <button
              type="button"
              className="btn btn-outline-light w-100"
              onClick={() => {
                setQuery('');
                loadBooks('');
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="alert alert-info">Loading books...</div>
      ) : (
        <div className="row g-4">
          {books.map((book) => (
            <div className="col-12 col-md-6 col-lg-4" key={book._id}>
              <div className="surface-card p-3 h-100">
                <img
                  src={getHighQualityCoverImage(book.coverImage)}
                  alt={book.title}
                  className="book-cover mb-3"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackCoverImage;
                  }}
                />
                <h5 className="mb-1">{book.title}</h5>
                <p className="text-muted-soft mb-1">{book.author}</p>
                <p className="mb-1">
                  <span className="badge text-bg-dark">{book.category}</span>
                </p>
                <p className="mb-3">Available: {book.availableCopies}</p>

                <div className="d-flex gap-2 flex-wrap">
                  <Link className="btn btn-sm btn-outline-info" to={`/books/${book._id}`}>
                    View Details
                  </Link>
                  <Link className="btn btn-sm btn-warning" to={`/books/${book._id}/edit`}>
                    Edit
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book._id)} type="button">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {books.length === 0 && <div className="text-muted-soft">No books found.</div>}
        </div>
      )}
    </div>
  );
}

export default BooksListPage;
