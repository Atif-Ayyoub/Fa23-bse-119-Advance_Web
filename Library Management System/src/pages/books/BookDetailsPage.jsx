import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, extractErrorMessage } from '../../services/api.js';

const fallbackCoverImage = 'https://placehold.co/300x400/11182D/E5ECF4?text=No+Cover';

function BookDetailsPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [bookResponse, recordsResponse] = await Promise.all([
          api.get(`/books/${bookId}`),
          api.get(`/books/${bookId}/borrow-records`),
        ]);
        setBook(bookResponse.data);
        setRecords(recordsResponse.data);
      } catch (requestError) {
        setError(extractErrorMessage(requestError, 'Failed to load book details'));
      }
    };

    loadDetails();
  }, [bookId]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!book) {
    return <div className="alert alert-info">Loading book details...</div>;
  }

  return (
    <div className="surface-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-title mb-0">Book Details</h2>
        <div className="d-flex gap-2">
          <Link to={`/books/${bookId}/edit`} className="btn btn-warning">
            Edit
          </Link>
          <Link to="/books" className="btn btn-outline-light">
            Back
          </Link>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <img
            src={book.coverImage || fallbackCoverImage}
            alt={book.title}
            className="book-cover"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackCoverImage;
            }}
          />
        </div>
        <div className="col-12 col-md-8">
          <h4>{book.title}</h4>
          <p className="text-muted-soft mb-1">Author: {book.author}</p>
          <p className="mb-1">ISBN: {book.isbn}</p>
          <p className="mb-1">Category: {book.category}</p>
          <p className="mb-1">Publication Year: {book.publicationYear}</p>
          <p className="mb-1">Shelf Location: {book.shelfLocation}</p>
          <p className="mb-0">Available Copies: {book.availableCopies}</p>
        </div>
      </div>

      <h5>Borrow Records</h5>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Member</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td>{record.memberId?.fullName || 'Unknown'}</td>
                <td>{new Date(record.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                <td>{record.status}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan="4" className="text-muted-soft">
                  No borrow records for this book.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookDetailsPage;
