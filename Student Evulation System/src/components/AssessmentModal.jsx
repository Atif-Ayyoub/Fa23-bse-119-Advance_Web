import React, { useEffect, useState } from 'react'
import Modal from './Modal'

export default function AssessmentModal({ open, onClose, onSave, initial, allowTypeSelect }) {
  const [form, setForm] = useState({ title: '', date: '', total_marks: '', type: 'quiz' })

  useEffect(() => {
    if (open) {
      setForm({
        title: initial?.title || '',
        date: initial?.date || '',
        total_marks: initial?.total_marks || '',
        type: initial?.type || 'quiz'
      })
    }
  }, [open, initial])

  return (
    <Modal open={open} title={initial ? 'Edit Assessment' : 'Add Assessment'} onClose={onClose}>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <label className="text-sm text-slate-600">Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border px-3 py-2 rounded-lg" />
        </div>
        <div>
          <label className="text-sm text-slate-600">Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border px-3 py-2 rounded-lg" />
        </div>
        <div>
          <label className="text-sm text-slate-600">Total Marks</label>
          <input type="number" value={form.total_marks} onChange={(e) => setForm({ ...form, total_marks: e.target.value })} className="w-full border px-3 py-2 rounded-lg" />
        </div>
        {allowTypeSelect && (
          <div>
            <label className="text-sm text-slate-600">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border px-3 py-2 rounded-lg">
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="project">Project</option>
            </select>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-3 py-2 rounded-lg border">Cancel</button>
        <button onClick={() => onSave(form)} className="px-3 py-2 rounded-lg bg-slate-900 text-white">Save</button>
      </div>
    </Modal>
  )
}
