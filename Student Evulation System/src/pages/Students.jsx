import React, { useMemo, useState } from 'react'
import Toast from '../components/Toast'
import StudentModal from '../components/StudentModal'
import ConfirmModal from '../components/ConfirmModal'
import SectionSelector from '../components/SectionSelector'
import BatchSelector from '../components/BatchSelector'
import { useStudents } from '../context/StudentsContext'
import { Search, UserPlus, Edit2, Trash2, CheckSquare, Square, Users, AlertTriangle } from 'lucide-react'

export default function Students() {
  const { students, loading, loadStudents, selectedSection, selectedBatch } = useStudents()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmInput, setConfirmInput] = useState('')

  function showToast(type, message) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const normalize = (v) => (v || '').toString().trim().toUpperCase()
    const baseSection = selectedSection && selectedSection !== 'All Sections'
      ? students.filter(s => normalize(s.section) === normalize(selectedSection))
      : students
    const base = selectedBatch ? baseSection.filter(s => Number(s.batch_id) === Number(selectedBatch.id)) : baseSection

    // debug: log current selectedSection and detected sections (first 10)
    try {
      const unique = Array.from(new Set(students.map(s => (s.section || '').toString().trim()))).slice(0, 20)
      console.log('Students: selectedSection=', selectedSection, 'uniqueSections=', unique)
    } catch (e) { /* ignore */ }
    return base.filter(s => [s.roll_no, s.name, s.section].join(' ').toLowerCase().includes(q))
  }, [students, search, selectedSection, selectedBatch])

  async function saveStudent(form) {
    if (!form.roll_no || !form.name) {
      showToast('error', 'Roll No and Name are required')
      return
    }
    if (editing) {
      const res = await window.electronAPI.updateStudent({ id: editing.id, ...form })
      if (res.success) {
        showToast('success', 'Student updated')
        setModalOpen(false)
        setEditing(null)
        await loadStudents()
      } else showToast('error', res.message || 'Update failed')
    } else {
      const payload = { ...form, batch_id: selectedBatch ? selectedBatch.id : null }
      const res = await window.electronAPI.addStudent(payload)
      if (res.success) {
        showToast('success', 'Student added')
        setModalOpen(false)
        await loadStudents()
      } else showToast('error', res.message || 'Add failed')
    }
  }

  async function deleteStudent(student) {
    const ok = confirm(`Delete ${student.name}?`)
    if (!ok) return
    const res = await window.electronAPI.deleteStudent(student.id)
    if (res.success) {
      showToast('success', 'Student deleted')
      await loadStudents()
    } else showToast('error', res.message || 'Delete failed')
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    const filteredIds = filtered.map(s => s.id)
    const allFiltered = filteredIds.every(id => selectedIds.includes(id))
    
    if (allFiltered && filteredIds.length > 0) {
      // Deselect all filtered items
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)))
    } else {
      // Select all filtered items (merge with existing)
      setSelectedIds(prev => [...new Set([...prev, ...filteredIds])])
    }
  }

  const bulkChangeSection = async () => {
    console.log('bulkChangeSection: Function called')
    console.log('bulkChangeSection: Selected IDs:', selectedIds)
    console.log('bulkChangeSection: Selected IDs length:', selectedIds.length)
    
    if (selectedIds.length === 0) {
      console.log('bulkChangeSection: No students selected')
      showToast('error', 'Please select students first')
      return
    }

    console.log('bulkChangeSection: Showing prompt for section')
    
    const newSection = prompt(`Enter new section for ${selectedIds.length} student(s):`)
    console.log('bulkChangeSection: Section entered:', newSection)
    
    if (newSection === null) {
      console.log('bulkChangeSection: User cancelled prompt')
      return
    }
    
    if (newSection.trim() === '') {
      console.log('bulkChangeSection: Empty section entered')
      showToast('info', 'Section update cancelled - no section entered')
      return
    }

    console.log('bulkChangeSection: Proceeding with section update to:', newSection.trim())

    try {
      console.log('bulkChangeSection: Calling API with:', { studentIds: selectedIds, section: newSection.trim() })
      
      const res = await window.electronAPI.bulkUpdateSection({ 
        studentIds: selectedIds, 
        section: newSection.trim() 
      })
      
      console.log('bulkChangeSection: API response:', res)
      
      if (res && res.success) {
      showToast('success', `Updated section for ${selectedIds.length} student(s)`)
      setSelectedIds([])
      await loadStudents()
      } else {
        console.error('bulkChangeSection: Update failed:', res)
        showToast('error', res?.message || 'Bulk update failed')
      }
    } catch (error) {
      console.error('bulkChangeSection: Exception caught:', error)
      showToast('error', 'An error occurred during bulk update')
    }
  }
  const clearAllData = async () => {
    console.log('Clear all data button clicked')

    // Open the typed-confirmation modal directly (avoid native confirm issues in dev/Electron)
    setConfirmInput('')
    setConfirmModalOpen(true)
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Students</h1>
          <p className="text-slate-600 mt-2">Manage student records</p>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => { setEditing(null); setModalOpen(true) }} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <UserPlus size={20} />
            Add Student
          </button>
          <button onClick={clearAllData} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <AlertTriangle size={20} />
            Clear All Data
          </button>
          <div className="ml-4 flex items-center gap-4">
            <BatchSelector />
            <SectionSelector />
          </div>
        </div>
      </div>

      <hr className="mb-6 border-slate-200" />

      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by roll/name/section" className="pl-10 pr-4 py-3 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <div className="mb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 shadow-lg flex items-center justify-between animate-in slide-in-from-top">
          <div className="flex items-center gap-3">
            <Users size={20} />
            <span className="font-semibold">{selectedIds.length} student(s) selected</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                console.log('Change Section button clicked - Event:', e)
                console.log('Change Section button - Selected IDs at click:', selectedIds)
                e.preventDefault()
                e.stopPropagation()
                bulkChangeSection()
              }} 
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors font-medium backdrop-blur-sm"
            >
              Change Section
            </button>
            <button 
              onClick={() => {
                console.log('Clear Selection button clicked')
                setSelectedIds([])
              }} 
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors font-medium backdrop-blur-sm"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-6 animate-pulse space-y-3">
            <div className="h-6 bg-slate-100 rounded"></div>
            <div className="h-6 bg-slate-100 rounded"></div>
            <div className="h-6 bg-slate-100 rounded"></div>
          </div>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button onClick={toggleSelectAll} className="hover:bg-slate-200 p-1 rounded transition-colors">
                    {(() => {
                      const filteredIds = filtered.map(s => s.id)
                      const allSelected = filteredIds.length > 0 && filteredIds.every(id => selectedIds.includes(id))
                      return allSelected ? (
                        <CheckSquare size={18} className="text-blue-600" />
                      ) : (
                        <Square size={18} />
                      )
                    })()}
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Roll No</th>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Section</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={s.id} className={`border-t hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} ${selectedIds.includes(s.id) ? 'bg-blue-50 ring-2 ring-blue-500' : ''}`}>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelect(s.id)} className="hover:bg-slate-200 p-1 rounded transition-colors">
                      {selectedIds.includes(s.id) ? (
                        <CheckSquare size={18} className="text-blue-600" />
                      ) : (
                        <Square size={18} className="text-slate-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700 roll-no-cell">{s.roll_no}</td>
                  <td className="px-6 py-4 text-slate-700">{s.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {s.section}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors flex items-center gap-1.5 text-sm font-medium" onClick={() => { setEditing(s); setModalOpen(true) }}>
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors flex items-center gap-1.5 text-sm font-medium" onClick={() => deleteStudent(s)}>
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <StudentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveStudent}
        initial={editing}
      />

      <ConfirmModal
        open={confirmModalOpen}
        title="Confirm Clear All Data"
        message={<>This will delete <strong>ALL</strong> students, assessments and marks. Type <code>DELETE ALL</code> to confirm.</>}
        value={confirmInput}
        onChange={(v) => setConfirmInput(v)}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={async () => {
          if (confirmInput !== 'DELETE ALL') {
            showToast('error', 'Clear cancelled - confirmation text did not match')
            return
          }
          setConfirmModalOpen(false)
          try {
            const res = await window.electronAPI.clearAllData()
            if (res && res.success) {
              showToast('success', 'All data cleared successfully')
              setSelectedIds([])
              await loadStudents()
            } else {
              showToast('error', res?.message || 'Failed to clear data')
            }
          } catch (err) {
            console.error('clearAllData modal submit error', err)
            showToast('error', 'An error occurred while clearing data')
          }
        }}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
