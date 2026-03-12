import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, extractErrorMessage } from '../../services/api.js';

const initialFormState = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  publicationYear: '',
  totalCopies: '',
  availableCopies: '',
  shelfLocation: '',
  coverImage: '',
};

function BookFormPage({ mode }) {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const loadBook = async () => {
      try {
        const response = await api.get(`/books/${bookId}`);
        const book = response.data;
        setFormData({
          title: book.title || '',
          author: book.author || '',
          isbn: book.isbn || '',
          category: book.category || '',
          publicationYear: book.publicationYear || '',
          totalCopies: book.totalCopies || '',
          availableCopies: book.availableCopies || '',
          shelfLocation: book.shelfLocation || '',
          coverImage: book.coverImage || '',
        });
      } catch (requestError) {
        setError(extractErrorMessage(requestError, 'Failed to load book')); 
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [bookId, isEdit]);

  const title = useMemo(() => (isEdit ? 'Edit Book' : 'Add Book'), [isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      publicationYear: Number(formData.publicationYear),
      totalCopies: Number(formData.totalCopies),
      availableCopies: Number(formData.availableCopies),
    };

    try {
      if (isEdit) {
        await api.put(`/books/${bookId}`, payload);
      } else {
        await api.post('/books', payload);
      }
      navigate('/books');
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Failed to save book'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading book data...</div>;
  }

  return (
    <div className="surface-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-title mb-0">{title}</h2>
        <Link to="/books" className="btn btn-outline-light">
          Back
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Title</label>
          <input name="title" value={formData.title} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Author</label>
          <input name="author" value={formData.author} onChange={handleChange} className="form-control" required />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">ISBN</label>
          <input name="isbn" value={formData.isbn} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Category</label>
          <input name="category" value={formData.category} onChange={handleChange} className="form-control" required />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Publication Year</label>
          <input
            type="number"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Total Copies</label>
          <input
            type="number"
            name="totalCopies"
            value={formData.totalCopies}
            onChange={handleChange}
            className="form-control"
            min="0"
            required
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Available Copies</label>
          <input
            type="number"
            name="availableCopies"
            value={formData.availableCopies}
            onChange={handleChange}
            className="form-control"
            min="0"
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Shelf Location</label>
          <input
            name="shelfLocation"
            value={formData.shelfLocation}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Cover Image URL (optional)</label>
          <input name="coverImage" value={formData.coverImage} onChange={handleChange} className="form-control" />
        </div>

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-success" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Submit'}
          </button>
          <button
            className="btn btn-outline-light"
            type="reset"
            onClick={() => setFormData(initialFormState)}
            disabled={submitting}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookFormPage;
