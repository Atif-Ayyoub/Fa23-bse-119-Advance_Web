import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, extractErrorMessage } from '../services/api.js';

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

function RecommendedBooksSection({ bookId, title = 'Recommended Books', autoLoad = false }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchRecommendations = async () => {
    if (!bookId) {
      return;
    }

    if (hasLoaded) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/books/${bookId}/recommendations`);
      setRecommendations(Array.isArray(response.data) ? response.data : []);
      setHasLoaded(true);
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Failed to load recommendations'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRecommendations([]);
    setError('');
    setHasLoaded(false);
  }, [bookId]);

  useEffect(() => {
    if (autoLoad && !hasLoaded && !loading && !error) {
      fetchRecommendations();
    }
  }, [autoLoad, hasLoaded, loading, error]);

  return (
    <section className="surface-card p-3 p-md-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="section-title mb-0">{title}</h5>
        <button
          type="button"
          className="btn btn-outline-info"
          onClick={fetchRecommendations}
          disabled={loading || !bookId || hasLoaded}
        >
          {loading ? 'Loading...' : hasLoaded ? 'Recommendations Loaded' : 'Show Recommendations'}
        </button>
      </div>

      {error && <div className="alert alert-danger mb-0">{error}</div>}

      {hasLoaded && recommendations.length === 0 && !error && (
        <p className="text-muted-soft mb-0">No recommendations found for this book.</p>
      )}

      {recommendations.length > 0 && (
        <div className="row g-3">
          {recommendations.slice(0, 10).map((book) => (
            <div key={book._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div className="surface-card recommendation-card p-3 h-100">
                <img
                  src={getHighQualityCoverImage(book.coverImage)}
                  alt={book.title}
                  className="book-cover recommendation-cover mb-2"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackCoverImage;
                  }}
                />
                <h6 className="mb-1 recommendation-title">{book.title}</h6>
                <p className="text-muted-soft mb-1 recommendation-meta">{book.author}</p>
                <p className="mb-2 recommendation-meta">
                  <span className="badge text-bg-dark">{book.category || 'General'}</span>
                </p>
                <Link className="btn btn-sm btn-outline-info w-100" to={`/books/${book._id}`}>
                  View Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecommendedBooksSection;
