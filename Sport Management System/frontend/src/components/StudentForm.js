import React, { useState } from 'react';
import axios from 'axios';

const StudentForm = ({ onStudentAdded, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      roll_no: '',
      class: '',
      phone: ''
    }
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        await axios.put(`/api/students/${initialData.id}`, formData);
      } else {
        await axios.post('/api/students', formData);
      }
      setFormData({
        name: '',
        roll_no: '',
        class: '',
        phone: ''
      });
      if (onStudentAdded) {
        onStudentAdded();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{initialData ? 'Update Student' : 'Add New Student'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter student name"
          />
        </div>

        <div className="form-group">
          <label>Roll Number *</label>
          <input
            type="text"
            name="roll_no"
            value={formData.roll_no}
            onChange={handleChange}
            required
            placeholder="Enter roll number"
          />
        </div>

        <div className="form-group">
          <label>Class *</label>
          <input
            type="text"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            placeholder="Enter class"
          />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Student' : 'Add Student'}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
