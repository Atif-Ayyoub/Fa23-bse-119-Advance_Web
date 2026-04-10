import React from 'react'
import { useStudents } from '../context/StudentsContext'

export default function BatchSelector({ className }) {
  const { batches, selectedBatch, setSelectedBatch, loadBatches } = useStudents()

  async function createBatch() {
    const name = prompt('Enter new batch name (e.g. Sp26)')
    if (!name) return
    const res = await window.electronAPI.createBatch(name.trim())
    if (res && res.success) {
      await loadBatches()
      // select created batch
      const b = (await window.electronAPI.getBatches()).find(x => x.batch_name === name.trim())
      if (b) setSelectedBatch(b)
    } else {
      alert(res.message || 'Failed to create batch')
    }
  }

  return (
    <div className={className}>
      <label className="text-sm font-medium text-slate-700 mr-2">Batch</label>
      <select
        value={selectedBatch ? selectedBatch.id : ''}
        onChange={(e) => {
          const id = Number(e.target.value) || null
          const b = batches.find(x => x.id === id) || null
          setSelectedBatch(b)
        }}
        className="border px-3 py-2 rounded mr-2"
      >
        {batches.map(b => (
          <option key={b.id} value={b.id}>{b.batch_name}</option>
        ))}
      </select>
      <button onClick={createBatch} className="px-3 py-2 rounded bg-slate-800 text-white text-sm">New</button>
    </div>
  )
}
