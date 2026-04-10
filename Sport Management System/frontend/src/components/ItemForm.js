import React, { useState } from 'react';
import axios from 'axios';

const ItemForm = ({ onItemAdded, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      category: '',
      total_quantity: ''
    }
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball', 'Volleyball', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (initialData && initialData.id) {
        await axios.put(`/api/items/${initialData.id}`, formData);
      } else {
        await axios.post('/api/items', formData);
      }
      setFormData({
        name: '',
        category: '',
        total_quantity: ''
      });
      if (onItemAdded) {
        onItemAdded();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{initialData ? 'Update Equipment' : 'Add New Equipment'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Equipment Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Cricket Bat"
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Total Quantity *</label>
          <input
            type="number"
            name="total_quantity"
            value={formData.total_quantity}
            onChange={handleChange}
            required
            min="1"
            placeholder="Enter quantity"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Equipment' : 'Add Equipment'}
        </button>
      </form>
    </div>
  );
};

export default ItemForm;
