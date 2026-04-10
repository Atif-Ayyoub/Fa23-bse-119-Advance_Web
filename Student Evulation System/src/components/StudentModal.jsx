import React, { useEffect, useState } from 'react'
import Modal from './Modal'

export default function StudentModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({ roll_no: '', name: '', section: '', email: '' })

  useEffect(() => {
    if (open) {
      setForm({
        roll_no: initial?.roll_no || '',
        name: initial?.name || '',
        section: initial?.section || '',
        email: initial?.email || ''
      })
    }
  }, [open, initial])

  return (
    <Modal open={open} title={initial ? 'Edit Student' : 'Add Student'} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600">Roll No</label>
          <input value={form.roll_no} onChange={(e) => setForm({ ...form, roll_no: e.target.value })} className="w-full border px-3 py-2 rounded-lg" />
        </div>
        <div>
          <label className="text-sm text-slate-600">Section</label>
          <input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="w-full border px-3 py-2 rounded-lg" />
        </div>
        <div className="col-span-2">
          <label className="text-sm text-slate-600">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border px-3 py-2 rounded-lg" />
        </div>
        <div className="col-span-2">
          <label className="text-sm text-slate-600">Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border px-3 py-2 rounded-lg" />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-3 py-2 rounded-lg border">Cancel</button>
        <button onClick={() => onSave(form)} className="px-3 py-2 rounded-lg bg-slate-900 text-white">Save</button>
      </div>
    </Modal>
  )
}
