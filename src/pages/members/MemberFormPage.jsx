import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, extractErrorMessage } from '../../services/api.js';

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  membershipId: '',
  address: '',
  dateJoined: '',
  status: 'active',
};

function MemberFormPage({ mode }) {
  const navigate = useNavigate();
  const { memberId } = useParams();
  const isEdit = mode === 'edit';
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const loadMember = async () => {
      try {
        const response = await api.get(`/members/${memberId}`);
        const member = response.data;

        setFormData({
          fullName: member.fullName || '',
          email: member.email || '',
          phone: member.phone || '',
          membershipId: member.membershipId || '',
          address: member.address || '',
          dateJoined: member.dateJoined ? new Date(member.dateJoined).toISOString().slice(0, 10) : '',
          status: member.status || 'active',
        });
      } catch (requestError) {
        setError(extractErrorMessage(requestError, 'Failed to load member'));
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [isEdit, memberId]);

  const title = useMemo(() => (isEdit ? 'Edit Member' : 'Add Member'), [isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isEdit) {
        await api.put(`/members/${memberId}`, formData);
      } else {
        await api.post('/members', formData);
      }
      navigate('/members');
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Failed to save member'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading member data...</div>;
  }

  return (
    <div className="surface-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-title mb-0">{title}</h2>
        <Link to="/members" className="btn btn-outline-light">
          Back
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Full Name</label>
          <input className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Email</label>
          <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Phone</label>
          <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Membership ID</label>
          <input
            className="form-control"
            name="membershipId"
            value={formData.membershipId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label">Address</label>
          <textarea className="form-control" name="address" rows="2" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Date Joined</label>
          <input
            className="form-control"
            type="date"
            name="dateJoined"
            value={formData.dateJoined}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Status</label>
          <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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

export default MemberFormPage;
