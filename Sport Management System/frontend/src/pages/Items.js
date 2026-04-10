import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemForm from '../components/ItemForm';

const Items = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/items');
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchItems();
      return;
    }

    try {
      const response = await axios.get(`/api/items/search?query=${searchTerm}`);
      setItems(response.data);
    } catch (err) {
      console.error('Error searching:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await axios.delete(`/api/items/${id}`);
        fetchItems();
      } catch (err) {
        alert(err.response?.data?.error || 'Error deleting equipment');
      }
    }
  };

  const handleItemAdded = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchItems();
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div>
      <h1>Equipment Management</h1>

      <button
        className="btn btn-primary"
        onClick={() => {
          setShowForm(!showForm);
          setEditingItem(null);
        }}
      >
        {showForm ? 'Hide Form' : '➕ Add New Equipment'}
      </button>

      {showForm && (
        <ItemForm
          onItemAdded={handleItemAdded}
          initialData={editingItem}
        />
      )}

      <div className="search-bar" style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Search by equipment name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-primary">
          🔍 Search
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Equipment List ({items.length})</h3>
        </div>
        {items.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Category</th>
                <th>Total Quantity</th>
                <th>Available</th>
                <th>Issued</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.total_quantity}</td>
                  <td>
                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                      {item.available_quantity}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                      {item.total_quantity - item.available_quantity}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setEditingItem(item);
                        setShowForm(true);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>
            No equipment found
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
