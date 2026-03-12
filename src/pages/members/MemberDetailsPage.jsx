import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, extractErrorMessage } from '../../services/api.js';

function MemberDetailsPage() {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMemberDetails = async () => {
      try {
        const [memberResponse, borrowedResponse, historyResponse] = await Promise.all([
          api.get(`/members/${memberId}`),
          api.get(`/members/${memberId}/borrowed-books`),
          api.get(`/members/${memberId}/borrow-records`),
        ]);

        setMember(memberResponse.data);
        setBorrowedBooks(borrowedResponse.data);
        setHistory(historyResponse.data);
      } catch (requestError) {
        setError(extractErrorMessage(requestError, 'Failed to load member details'));
      }
    };

    loadMemberDetails();
  }, [memberId]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!member) {
    return <div className="alert alert-info">Loading member details...</div>;
  }

  return (
    <div className="surface-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-title mb-0">Member Details</h2>
        <div className="d-flex gap-2">
          <Link to={`/members/${memberId}/edit`} className="btn btn-warning">
            Edit
          </Link>
          <Link to="/members" className="btn btn-outline-light">
            Back
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="p-3 rounded-3 border border-secondary-subtle h-100">
            <h5>{member.fullName}</h5>
            <p className="mb-1">Email: {member.email}</p>
            <p className="mb-1">Phone: {member.phone}</p>
            <p className="mb-1">Membership ID: {member.membershipId}</p>
            <p className="mb-1">Address: {member.address}</p>
            <p className="mb-0">Status: {member.status}</p>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="p-3 rounded-3 border border-secondary-subtle h-100">
            <h6 className="mb-3">Currently Borrowed Books</h6>
            {borrowedBooks.length === 0 && <p className="text-muted-soft mb-0">No active borrowed books.</p>}
            {borrowedBooks.map((entry) => (
              <div key={entry.recordId} className="mb-2 pb-2 border-bottom border-secondary-subtle">
                <strong>{entry.book?.title}</strong>
                <div className="small text-muted-soft">Due: {new Date(entry.dueDate).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h5>Borrowing History</h5>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Book</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record._id}>
                <td>{record.bookId?.title || 'Unknown'}</td>
                <td>{new Date(record.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                <td>{record.returnDate ? new Date(record.returnDate).toLocaleDateString() : '-'}</td>
                <td>{record.status}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan="5" className="text-muted-soft">
                  No borrowing history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MemberDetailsPage;
