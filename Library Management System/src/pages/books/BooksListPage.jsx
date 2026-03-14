import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, extractErrorMessage } from '../../services/api.js';

const fallbackCoverImage = 'https://placehold.co/300x400/11182D/E5ECF4?text=No+Cover';
const booksCacheKey = 'lms_books_cache_v1';

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
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 24;

  const persistBooksCache = (bookList) => {
    try {
      localStorage.setItem(booksCacheKey, JSON.stringify(bookList));
    } catch {
      // Ignore cache write failures.
    }
  };

  const loadBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/books');
      setBooks(response.data);
      persistBooksCache(response.data);
      setCurrentPage(1);
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Failed to load books'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const cachedBooksText = localStorage.getItem(booksCacheKey);
      if (cachedBooksText) {
        const cachedBooks = JSON.parse(cachedBooksText);
        if (Array.isArray(cachedBooks)) {
          setBooks(cachedBooks);
          setLoading(false);
        }
      }
    } catch {
      // Ignore cache parse failures.
    }

    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return books;
    }

    return books.filter((book) => {
      const title = String(book.title || '').toLowerCase();
      const author = String(book.author || '').toLowerCase();
      const category = String(book.category || '').toLowerCase();

      return (
        title.includes(normalizedQuery) ||
        author.includes(normalizedQuery) ||
        category.includes(normalizedQuery)
      );
    });
  }, [books, query]);

  const titleSuggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    const uniqueTitles = new Set();
    const startsWithMatches = [];
    const includesMatches = [];

    for (const book of books) {
      const title = String(book.title || '').trim();
      if (!title) {
        continue;
      }

      const normalizedTitle = title.toLowerCase();
      if (!normalizedTitle.includes(normalizedQuery) || uniqueTitles.has(normalizedTitle)) {
        continue;
      }

      uniqueTitles.add(normalizedTitle);

      if (normalizedTitle.startsWith(normalizedQuery)) {
        startsWithMatches.push(title);
      } else {
        includesMatches.push(title);
      }
    }

    return [...startsWithMatches, ...includesMatches].slice(0, 10);
  }, [books, query]);

  const summary = useMemo(
    () => ({
      total: filteredBooks.length,
      available: filteredBooks.filter((book) => book.availableCopies > 0).length,
    }),
    [filteredBooks]
  );

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredBooks.length / pageSize)), [filteredBooks.length]);

  const visibleBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBooks.slice(startIndex, startIndex + pageSize);
  }, [filteredBooks, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const handleDelete = async (bookId) => {
    if (!window.confirm('Delete this book?')) {
      return;
    }

    try {
      await api.delete(`/books/${bookId}`);
      await loadBooks();
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
              autoComplete="off"
              list="book-title-suggestions"
              onChange={(event) => setQuery(event.target.value)}
            />
            <datalist id="book-title-suggestions">
              {titleSuggestions.map((suggestedTitle) => (
                <option key={suggestedTitle} value={suggestedTitle} />
              ))}
            </datalist>
          </div>
          <div className="col-12 col-md-4 d-flex gap-2">
            <button type="button" className="btn btn-info w-100" onClick={() => setCurrentPage(1)}>
              Search
            </button>
            <button
              type="button"
              className="btn btn-outline-light w-100"
              onClick={() => {
                setQuery('');
                setCurrentPage(1);
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
          {visibleBooks.map((book) => (
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
          {filteredBooks.length === 0 && <div className="text-muted-soft">No books found.</div>}
        </div>
      )}

      {!loading && filteredBooks.length > pageSize && (
        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
          <p className="text-muted-soft mb-0">
            Page {currentPage} of {totalPages}
          </p>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-light"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((previousPage) => Math.max(1, previousPage - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-outline-light"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((previousPage) => Math.min(totalPages, previousPage + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BooksListPage;
