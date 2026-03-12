import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, extractErrorMessage } from '../../services/api.js';

function MembersListPage() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadMembers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Failed to load members'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleDelete = async (memberId) => {
    if (!window.confirm('Delete this member?')) {
      return;
    }

    try {
      await api.delete(`/members/${memberId}`);
      await loadMembers();
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Failed to delete member'));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="section-title mb-1">Members</h2>
          <p className="text-muted-soft mb-0">Manage active and inactive library members.</p>
        </div>
        <Link to="/members/new" className="btn btn-success glow-btn">
          Add Member
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="surface-card p-3 table-responsive">
        {loading ? (
          <div className="alert alert-info mb-0">Loading members...</div>
        ) : (
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Membership ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id}>
                  <td>{member.fullName}</td>
                  <td>{member.email}</td>
                  <td>{member.membershipId}</td>
                  <td>
                    <span className={`badge ${member.status === 'active' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="d-flex gap-2 flex-wrap">
                    <Link className="btn btn-sm btn-outline-info" to={`/members/${member._id}`}>
                      View Details
                    </Link>
                    <Link className="btn btn-sm btn-warning" to={`/members/${member._id}/edit`}>
                      Edit
                    </Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(member._id)} type="button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {members.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-muted-soft">
                    No members available.
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

export default MembersListPage;
