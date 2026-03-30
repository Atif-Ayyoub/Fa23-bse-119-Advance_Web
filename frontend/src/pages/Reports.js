import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/transactions');
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const filteredData = filterStatus === 'all'
      ? transactions
      : transactions.filter((t) => t.status === filterStatus);

    const csv = [
      ['Student Name', 'Student ID', 'Roll No', 'Equipment', 'Category', 'Quantity', 'Issue Date', 'Return Date', 'Status'],
      ...filteredData.map((t) => [
        t.student_name,
        t.student_code,
        t.roll_no,
        t.item_name,
        t.category,
        t.quantity,
        new Date(t.issue_date).toLocaleDateString(),
        t.return_date ? new Date(t.return_date).toLocaleDateString() : 'Pending',
        t.status
      ])
    ];

    const csvContent = csv.map((row) => row.map((val) => `"${val}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  const filteredTransactions = filterStatus === 'all'
    ? transactions
    : transactions.filter((t) => t.status === filterStatus);

  return (
    <div>
      <h1>Reports & History</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #bdc3c7' }}
        >
          <option value="all">All Transactions</option>
          <option value="issued">Issued</option>
          <option value="returned">Returned</option>
        </select>
        <button onClick={handleExportCSV} className="btn btn-primary">
          📥 Export to CSV
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Transaction History ({filteredTransactions.length})</h3>
        </div>
        {filteredTransactions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Equipment</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  style={{
                    backgroundColor:
                      transaction.status === 'returned' ? '#e8f5e9' : '#fff3e0'
                  }}
                >
                  <td>{transaction.student_name}</td>
                  <td>{transaction.student_code}</td>
                  <td>{transaction.item_name}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.quantity}</td>
                  <td>{new Date(transaction.issue_date).toLocaleDateString()}</td>
                  <td>
                    {transaction.return_date
                      ? new Date(transaction.return_date).toLocaleDateString()
                      : 'Pending'}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '15px',
                        backgroundColor:
                          transaction.status === 'returned'
                            ? '#27ae60'
                            : '#f39c12',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>
            No transactions found
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
        <h3>Summary Statistics</h3>
        <p>Total Transactions: <strong>{filteredTransactions.length}</strong></p>
        <p>Issued: <strong>{filteredTransactions.filter((t) => t.status === 'issued').length}</strong></p>
        <p>Returned: <strong>{filteredTransactions.filter((t) => t.status === 'returned').length}</strong></p>
      </div>
    </div>
  );
};

export default Reports;
