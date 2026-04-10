import React, { useEffect, useMemo, useState } from 'react'
import Toast from '../components/Toast'
import AssessmentModal from '../components/AssessmentModal'
import { Plus, Edit2, Trash2, Target, FileText, Award } from 'lucide-react'

export default function Assessments() {
  const [assessments, setAssessments] = useState({ quizzes: [], assignments: [], projects: [] })
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => { load() }, [])

  function showToast(type, message) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  async function load() {
    setLoading(true)
    const a = await window.electronAPI.getAssessments()
    setAssessments(a)
    setLoading(false)
  }

  const list = useMemo(() => {
    const rows = []
    for (const q of assessments.quizzes) rows.push({ ...q, type: 'quiz' })
    for (const a of assessments.assignments) rows.push({ ...a, type: 'assignment' })
    for (const p of assessments.projects) rows.push({ ...p, type: 'project' })
    return rows
  }, [assessments])

  async function saveAssessment(form) {
    if (!form.title || !form.date || !form.total_marks) {
      showToast('error', 'All fields required')
      return
    }

    if (editing) {
      const res = await window.electronAPI.updateAssessment({
        id: editing.id,
        type: form.type || editing.type,
        title: form.title,
        date: form.date,
        total_marks: Number(form.total_marks)
      })
      if (res.success) {
        showToast('success', 'Assessment updated')
        setModalOpen(false)
        setEditing(null)
        load()
      } else showToast('error', res.message || 'Update failed')
    } else {
      const res = await window.electronAPI.addAssessment({
        type: form.type,
        title: form.title,
        date: form.date,
        total_marks: Number(form.total_marks)
      })
      if (res.success) {
        showToast('success', 'Assessment added')
        setModalOpen(false)
        load()
      } else showToast('error', res.message || 'Add failed')
    }
  }

  async function deleteAssessment(item) {
    const ok = confirm(`Delete ${item.title}?`)
    if (!ok) return
    const res = await window.electronAPI.deleteAssessment({ id: item.id, type: item.type })
    if (res.success) {
      showToast('success', 'Assessment deleted')
      load()
    } else showToast('error', res.message || 'Delete failed')
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Assessments</h1>
          <p className="text-slate-600 mt-2">Manage quizzes, assignments, and projects</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true) }} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
          <Plus size={20} />
          Add Assessment
        </button>
      </div>

      <hr className="mb-6 border-slate-200" />

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
                <th className="px-6 py-4 text-left font-semibold">Title</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-left font-semibold">Total Marks</th>
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, idx) => {
                const Icon = item.type === 'quiz' ? Target : item.type === 'assignment' ? FileText : Award;
                const displayTitle = item.type === 'quiz' ? `Quiz ${item.title}` : item.type === 'assignment' ? `Assignment ${item.id}: ${item.title}` : `Project ${item.id}: ${item.title}`;
                return (
                  <tr key={`${item.type}-${item.id}`} className={`border-t hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="px-6 py-4 font-semibold text-slate-700 flex items-center gap-2">
                      <Icon size={18} className={item.type === 'quiz' ? 'text-emerald-600' : item.type === 'assignment' ? 'text-amber-600' : 'text-indigo-600'} />
                      {displayTitle}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{item.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {item.total_marks} marks
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize text-slate-600">{item.type}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors flex items-center gap-1.5 text-sm font-medium" onClick={() => { setEditing(item); setModalOpen(true) }}>
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors flex items-center gap-1.5 text-sm font-medium" onClick={() => deleteAssessment(item)}>
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AssessmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveAssessment}
        initial={editing}
        allowTypeSelect={true}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
