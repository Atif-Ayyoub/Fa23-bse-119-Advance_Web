import React from 'react'

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-4xl max-h-[80vh] overflow-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-slate-500 hover:text-slate-800" onClick={onClose}>Close</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
