import React from 'react'
import Modal from './Modal'

export default function AssessmentViewModal({ open, onClose, assessment, onRequestEdit }) {
  if (!assessment) return null
  return (
    <Modal open={open} title={`View Assessment: ${assessment.title}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-600">Title</label>
          <div className="mt-1 text-slate-800 font-medium">{assessment.title}</div>
        </div>
        <div>
          <label className="text-sm text-slate-600">Date</label>
          <div className="mt-1 text-slate-800">{assessment.date}</div>
        </div>
        <div>
          <label className="text-sm text-slate-600">Total Marks</label>
          <div className="mt-1 text-slate-800">{assessment.total_marks}</div>
        </div>
        <div>
          <label className="text-sm text-slate-600">Type</label>
          <div className="mt-1 text-slate-800">{assessment.type || 'quiz'}</div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-3 py-2 rounded-lg border">Close</button>
        <button onClick={onRequestEdit} className="px-3 py-2 rounded-lg bg-amber-600 text-white">Update Assessment</button>
      </div>
    </Modal>
  )
}
