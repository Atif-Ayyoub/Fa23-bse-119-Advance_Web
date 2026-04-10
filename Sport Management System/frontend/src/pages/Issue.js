import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Issue = () => {
  const [students, setStudents] = useState([]);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    item_id: '',
    quantity: '',
    issue_date: new Date().toISOString().split('T')[0],
    expected_return_date: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, itemsRes] = await Promise.all([
        axios.get('/api/students'),
        axios.get('/api/items')
      ]);
      setStudents(studentsRes.data);
      setItems(itemsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post('/api/transactions/issue', {
        ...formData,
        student_id: parseInt(formData.student_id),
        item_id: parseInt(formData.item_id),
        quantity: parseInt(formData.quantity)
      });

      setMessage('✓ Equipment issued successfully!');
      setFormData({
        student_id: '',
        item_id: '',
        quantity: '',
        issue_date: new Date().toISOString().split('T')[0],
        expected_return_date: ''
      });

      setTimeout(() => setMessage(''), 3000);
      fetchData();
    } catch (err) {
      setMessage('✗ Error: ' + (err.response?.data?.error || 'Failed to issue equipment'));
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div>
      <h1>Issue Equipment</h1>

      <div className="form-container">
        {message && (
          <div
            className={`alert ${message.startsWith('✓') ? 'alert-success' : 'alert-danger'}`}
            style={{ marginBottom: '20px' }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Student *</label>
            <select
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
            >
              <option value="">Choose a student...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.roll_no}) - {student.student_id}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Equipment *</label>
            <select
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              required
            >
              <option value="">Choose equipment...</option>
              {items
                .filter((item) => item.available_quantity > 0)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.category}) - Available: {item.available_quantity}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              placeholder="Enter quantity"
            />
          </div>

          <div className="form-group">
            <label>Issue Date *</label>
            <input
              type="date"
              name="issue_date"
              value={formData.issue_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Expected Return Date</label>
            <input
              type="date"
              name="expected_return_date"
              value={formData.expected_return_date}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success">
            📤 Issue Equipment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Issue;
