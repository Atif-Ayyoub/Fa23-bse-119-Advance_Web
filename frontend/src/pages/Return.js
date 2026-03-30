import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Return = () => {
  const [issuedItems, setIssuedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchIssuedItems();
  }, []);

  const fetchIssuedItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/transactions/issued');
      setIssuedItems(response.data);
    } catch (err) {
      console.error('Error fetching issued items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (transactionId) => {
    try {
      const returnDate = new Date().toISOString().split('T')[0];
      await axios.post('/api/transactions/return', {
        transaction_id: transactionId,
        return_date: returnDate
      });

      setMessage('✓ Equipment returned successfully!');
      fetchIssuedItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('✗ Error: ' + (err.response?.data?.error || 'Failed to return equipment'));
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div>
      <h1>Return Equipment</h1>

      {message && (
        <div
          className={`alert ${message.startsWith('✓') ? 'alert-success' : 'alert-danger'}`}
          style={{ marginBottom: '20px' }}
        >
          {message}
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <h3>Active Issues ({issuedItems.length})</h3>
        </div>
        {issuedItems.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll No</th>
                <th>Equipment</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Issue Date</th>
                <th>Expected Return</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issuedItems.map((item) => {
                const today = new Date();
                const expectedReturn = new Date(item.return_date);
                const isLate = today > expectedReturn && item.return_date;

                return (
                  <tr key={item.id} style={isLate ? { backgroundColor: '#ffe6e6' } : {}}>
                    <td>{item.student_name}</td>
                    <td>{item.roll_no}</td>
                    <td>{item.item_name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{new Date(item.issue_date).toLocaleDateString()}</td>
                    <td>
                      {item.return_date ? new Date(item.return_date).toLocaleDateString() : 'N/A'}
                      {isLate && <span style={{ color: '#e74c3c' }}> (Late)</span>}
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleReturn(item.id)}
                      >
                        📥 Return
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>
            No active issues. All equipment has been returned!
          </div>
        )}
      </div>
    </div>
  );
};

export default Return;
