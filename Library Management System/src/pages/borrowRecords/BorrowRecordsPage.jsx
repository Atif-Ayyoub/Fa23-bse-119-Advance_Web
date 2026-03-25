import { useEffect, useMemo, useState } from 'react';
import { api, extractErrorMessage } from '../../services/api.js';

const initialFormState = {
  memberId: '',
  bookId: '',
  borrowDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
};

function BorrowRecordsPage() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [bookSearch, setBookSearch] = useState('');
  const [booksLoading, setBooksLoading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPageData = async () => {
    setLoading(true);
    setError('');

    try {
      const [membersResponse, recordsResponse] = await Promise.all([api.get('/members'), api.get('/borrow-records')]);

      setMembers(membersResponse.data);
      setRecords(recordsResponse.data);
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Failed to load borrowing data'));
    } finally {
      setLoading(false);
    }
  };

  const loadBooksForSelection = async (searchText = '') => {
    setBooksLoading(true);

    try {
      const response = await api.get('/books', {
        params: {
          query: searchText || undefined,
          limit: 30,
          compact: true,
          availableOnly: true,
        },
      });

      setBooks(response.data);
    } catch {
      // Keep previous options when lightweight book query fails.
    } finally {
      setBooksLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
    loadBooksForSelection('');
  }, []);

  useEffect(() => {
    const debounceId = setTimeout(() => {
      loadBooksForSelection(bookSearch.trim());
    }, 250);

    return () => clearTimeout(debounceId);
  }, [bookSearch]);

  const titleSuggestions = useMemo(() => {
    const normalizedQuery = bookSearch.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    const seen = new Set();
    const startsWithMatches = [];
    const includesMatches = [];

    for (const book of books) {
      const title = String(book.title || '').trim();
      if (!title) {
        continue;
      }

      const normalizedTitle = title.toLowerCase();
      if (!normalizedTitle.includes(normalizedQuery) || seen.has(normalizedTitle)) {
        continue;
      }

      seen.add(normalizedTitle);

      if (normalizedTitle.startsWith(normalizedQuery)) {
        startsWithMatches.push(title);
      } else {
        includesMatches.push(title);
      }
    }

    return [...startsWithMatches, ...includesMatches].slice(0, 10);
  }, [books, bookSearch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (name === 'bookId') {
      const selected = books.find((book) => book._id === value);
      if (selected) {
        setBookSearch(selected.title);
      }
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/borrow-records', formData);
      setFormData(initialFormState);
      setBookSearch('');
      await loadPageData();
      await loadBooksForSelection('');
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Failed to issue book'));
    }
  };

  const handleReturn = async (recordId) => {
    setError('');

    try {
      await api.put(`/borrow-records/${recordId}`, {
        status: 'returned',
        returnDate: new Date().toISOString(),
      });
      await loadPageData();
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Failed to return book'));
    }
  };

  return (
    <div>
      <h2 className="section-title mb-3">Borrowed Books</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="surface-card p-4 mb-4">
        <h5 className="mb-3">Issue a Book</h5>
        <form className="row g-3" onSubmit={handleCreate}>
          <div className="col-12 col-md-6">
            <label className="form-label">Member</label>
            <select className="form-select" name="memberId" value={formData.memberId} onChange={handleChange} required>
              <option value="">Select Member</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.fullName} ({member.membershipId})
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Book</label>
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Type to search books..."
              value={bookSearch}
              autoComplete="off"
              list="borrow-book-title-suggestions"
              onChange={(event) => {
                const value = event.target.value;
                setBookSearch(value);

                const matchedBook = books.find(
                  (book) => String(book.title || '').trim().toLowerCase() === value.trim().toLowerCase()
                );

                setFormData((previous) => ({
                  ...previous,
                  bookId: matchedBook?._id || '',
                }));
              }}
            />
            <datalist id="borrow-book-title-suggestions">
              {titleSuggestions.map((suggestedTitle) => (
                <option key={suggestedTitle} value={suggestedTitle} />
              ))}
            </datalist>
            <select className="form-select" name="bookId" value={formData.bookId} onChange={handleChange} required>
              <option value="">{booksLoading ? 'Loading books...' : 'Select Book'}</option>
              {books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} (Available: {book.availableCopies})
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Borrow Date</label>
            <input
              className="form-control"
              type="date"
              name="borrowDate"
              value={formData.borrowDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Due Date</label>
            <input className="form-control" type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
          </div>

          <div className="col-12 d-flex gap-2">
            <button className="btn btn-success" type="submit">
              Borrow
            </button>
            <button
              className="btn btn-outline-light"
              type="reset"
              onClick={() => {
                setFormData(initialFormState);
                setBookSearch('');
                loadBooksForSelection('');
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="surface-card p-3 table-responsive">
        {loading ? (
          <div className="alert alert-info mb-0">Loading records...</div>
        ) : (
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Member</th>
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id}>
                  <td>{record.memberId?.fullName || 'Unknown'}</td>
                  <td>{record.bookId?.title || 'Unknown'}</td>
                  <td>{new Date(record.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                  <td>{record.returnDate ? new Date(record.returnDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`badge ${record.status === 'borrowed' ? 'text-bg-warning' : 'text-bg-success'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    {record.status === 'borrowed' ? (
                      <button className="btn btn-sm btn-primary" type="button" onClick={() => handleReturn(record._id)}>
                        Return
                      </button>
                    ) : (
                      <span className="text-muted-soft">Returned</span>
                    )}
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-muted-soft">
                    No borrow records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BorrowRecordsPage;
