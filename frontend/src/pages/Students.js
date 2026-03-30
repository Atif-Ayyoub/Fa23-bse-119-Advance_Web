import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentForm from '../components/StudentForm';
import * as XLSX from 'xlsx';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [importMessage, setImportMessage] = useState('');
  const [showImportForm, setShowImportForm] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchStudents();
      return;
    }

    try {
      const response = await axios.get(`/api/students/search?query=${searchTerm}`);
      setStudents(response.data);
    } catch (err) {
      console.error('Error searching:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`/api/students/${id}`);
        fetchStudents();
      } catch (err) {
        alert('Error deleting student');
      }
    }
  };

  const handleStudentAdded = () => {
    setShowForm(false);
    setEditingStudent(null);
    fetchStudents();
  };

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setImportMessage('Reading file...');
      
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        setImportMessage('❌ Error: File is empty');
        return;
      }

      // Validate and map Excel columns to student fields
      const students_to_import = jsonData.map((row) => ({
        name: row.name || row.Name || row.NAME || '',
        roll_no: row.roll_no || row.roll_number || row.Roll || row.ROLL || '',
        class: row.class || row.Class || row.CLASS || '',
        phone: row.phone || row.Phone || row.PHONE || ''
      }));

      setImportMessage('Uploading students...');

      const response = await axios.post('/api/students/bulk/import', {
        students: students_to_import
      });

      setImportMessage(
        `✓ Imported ${response.data.successCount} students${
          response.data.errorCount > 0
            ? ` (${response.data.errorCount} errors)`
            : ''
        }`
      );

      if (response.data.errors.length > 0) {
        console.log('Import Errors:', response.data.errors);
        setImportMessage(
          `✓ Imported ${response.data.successCount}/${response.data.totalCount} students\n\nErrors:\n${response.data.errors.slice(0, 5).join('\n')}`
        );
      }

      event.target.value = '';
      setTimeout(() => {
        fetchStudents();
        setShowImportForm(false);
        setImportMessage('');
      }, 1000);
    } catch (err) {
      setImportMessage('❌ Error importing file: ' + (err.response?.data?.error || err.message));
      console.error('Error:', err);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: 'John Doe',
        roll_no: 'A001',
        class: '10A',
        phone: '9876543210'
      },
      {
        name: 'Jane Smith',
        roll_no: 'A002',
        class: '10A',
        phone: '9876543211'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'students_template.xlsx');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div>
      <h1>Students Management</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingStudent(null);
          }}
        >
          {showForm ? 'Hide Form' : '➕ Add New Student'}
        </button>

        <button
          className="btn btn-success"
          onClick={() => setShowImportForm(!showImportForm)}
        >
          {showImportForm ? 'Hide Import' : '📤 Import from Excel/CSV'}
        </button>

        <button className="btn btn-secondary" onClick={downloadTemplate}>
          📥 Download Template
        </button>
      </div>

      {showForm && (
        <StudentForm
          onStudentAdded={handleStudentAdded}
          initialData={editingStudent}
        />
      )}

      {showImportForm && (
        <div className="form-container" style={{ marginBottom: '20px' }}>
          <h3>📤 Bulk Import Students</h3>
          <div className="form-group">
            <label>Select Excel or CSV file *</label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileImport}
              style={{ padding: '10px' }}
            />
            <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '10px' }}>
              ℹ️ Supported formats: Excel (.xlsx, .xls) or CSV<br/>
              Columns needed: name, roll_no, class, phone<br/>
              <button onClick={(e) => { e.preventDefault(); downloadTemplate(); }} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', textDecoration: 'underline' }}>
                Download template
              </button>
            </p>
          </div>
          {importMessage && (
            <div
              className={`alert ${importMessage.startsWith('✓') ? 'alert-success' : 'alert-danger'}`}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {importMessage}
            </div>
          )}
        </div>
      )}

      <div className="search-bar" style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-primary">
          🔍 Search
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Students List ({students.length})</h3>
        </div>
        {students.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Class</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.student_id}</td>
                  <td>{student.name}</td>
                  <td>{student.roll_no}</td>
                  <td>{student.class}</td>
                  <td>{student.phone}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setEditingStudent(student);
                        setShowForm(true);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(student.id)}
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
            No students found
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
