import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function ConfirmModal({ open, title, message, value, onChange, onCancel, onConfirm }) {
  const inputRef = useRef(null)
  const dialogRef = useRef(null)

  // keep latest callbacks in refs so effect doesn't need to depend on them
  const onCancelRef = useRef(onCancel)
  const onConfirmRef = useRef(onConfirm)
  useEffect(() => { onCancelRef.current = onCancel }, [onCancel])
  useEffect(() => { onConfirmRef.current = onConfirm }, [onConfirm])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // autofocus input and place caret at end without selecting text
    const focusInput = () => {
      const el = inputRef.current
      if (!el) return
      try {
        el.focus()
        const len = (el.value || '').length
        if (typeof el.setSelectionRange === 'function') el.setSelectionRange(len, len)
      } catch (e) {
        // ignore
      }
    }

    const rafId = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(focusInput) : setTimeout(focusInput, 0)

    const onKey = (e) => {
      if (e.key === 'Escape') onCancelRef.current && onCancelRef.current()
      if (e.key === 'Enter') onConfirmRef.current && onConfirmRef.current()
      if (e.key === 'Tab') {
        // simple focus trap
        const focusable = dialogRef.current?.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])') || []
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId)
      else clearTimeout(rafId)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/40 z-0" onClick={onCancel} />
      <div ref={dialogRef} className="relative bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-6 z-50" style={{pointerEvents: 'auto'}}>
        <div className="mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="mb-4 text-slate-700">{message}</div>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => { if (typeof onChange === 'function') onChange(e.target.value) }}
          placeholder="DELETE ALL"
          className="w-full px-3 py-2 border rounded mb-4"
          readOnly={false}
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded border" onClick={onCancel}>Cancel</button>
          <button className="px-4 py-2 rounded bg-rose-600 text-white" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>, document.body
  )
}
