import React from 'react'

export default function Toast({ toast, onClose }) {
  if (!toast) return null
  const tone = toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className={`${tone} text-white shadow-lg rounded-xl px-4 py-3 flex items-center gap-3 animate-[fadeIn_0.3s_ease]`}>
        <div className="text-sm font-semibold">{toast.message}</div>
        <button className="text-white/80 hover:text-white" onClick={onClose}>Dismiss</button>
      </div>
    </div>
  )
}
