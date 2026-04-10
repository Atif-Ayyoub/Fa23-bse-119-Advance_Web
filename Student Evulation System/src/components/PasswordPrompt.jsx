import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function PasswordPrompt({ open, title = 'Enter Password', onCancel, onConfirm }) {
  const inputRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusInput = () => {
      const el = inputRef.current
      if (!el) return
      try { el.focus() } catch (e) {}
    }
    const rafId = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(focusInput) : setTimeout(focusInput, 0)
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel && onCancel()
      if (e.key === 'Enter') onConfirm && onConfirm(inputRef.current && inputRef.current.value)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId)
      else clearTimeout(rafId)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onCancel, onConfirm])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/40 z-0" onClick={onCancel} />
      <div ref={dialogRef} className="relative bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-6 z-50" style={{pointerEvents: 'auto'}}>
        <div className="mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="mb-4 text-slate-700">Enter the admin password to allow editing.</div>
        <input ref={inputRef} type="password" placeholder="Password" className="w-full px-3 py-2 border rounded mb-4" />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded border" onClick={onCancel}>Cancel</button>
          <button className="px-4 py-2 rounded bg-slate-900 text-white" onClick={() => onConfirm && onConfirm(inputRef.current && inputRef.current.value)}>Confirm</button>
        </div>
      </div>
    </div>, document.body
  )
}
