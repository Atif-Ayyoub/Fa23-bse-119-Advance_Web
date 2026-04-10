import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    issuedItems: 0,
    availableItems: 0,
    activeStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const itemsRes = await axios.get('/api/items/stats/overview');
      const studentsRes = await axios.get('/api/students/stats/count');

      setStats({
        totalItems: itemsRes.data.totalItems || 0,
        issuedItems: itemsRes.data.issuedItems || 0,
        availableItems: itemsRes.data.availableItems || 0,
        activeStudents: studentsRes.data.activeStudents || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="dashboard">
        <div className="card success">
          <div className="card-title">Total Equipment</div>
          <div className="card-value">{stats.totalItems}</div>
        </div>

        <div className="card info">
          <div className="card-title">Available Equipment</div>
          <div className="card-value">{stats.availableItems}</div>
        </div>

        <div className="card warning">
          <div className="card-title">Issued Equipment</div>
          <div className="card-value">{stats.issuedItems}</div>
        </div>

        <div className="card danger">
          <div className="card-title">Active Students</div>
          <div className="card-value">{stats.activeStudents}</div>
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center', color: '#7f8c8d' }}>
        <p>Welcome to Sports Equipment Management System</p>
        <p>Use the menu to manage students, equipment, and transactions</p>
      </div>
    </div>
  );
};

export default Dashboard;
