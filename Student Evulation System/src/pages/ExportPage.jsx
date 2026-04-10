import React, { useEffect, useMemo, useState } from 'react'
import Toast from '../components/Toast'
import SectionSelector from '../components/SectionSelector'
import BatchSelector from '../components/BatchSelector'
import { useStudents } from '../context/StudentsContext'
import { FileSpreadsheet, Copy, Download } from 'lucide-react'

export default function ExportPage() {
  const [assessments, setAssessments] = useState([])
  const [selectedKey, setSelectedKey] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const { selectedSection, selectedBatch } = useStudents()

  useEffect(() => { loadAssessments() }, [])

  useEffect(() => {
    if (selectedKey) loadMarks(selectedKey)
  }, [selectedBatch])

  function showToast(type, message) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  async function loadAssessments() {
    setLoading(true)
    const data = await window.electronAPI.getAssessments()
    const list = []
    for (const q of data.quizzes) list.push({ ...q, type: 'quiz' })
    for (const a of data.assignments) list.push({ ...a, type: 'assignment' })
    for (const p of data.projects) list.push({ ...p, type: 'project' })
    setAssessments(list)
    setLoading(false)
  }

  const selected = useMemo(() => {
    return assessments.find(a => `${a.type}:${a.id}` === selectedKey)
  }, [assessments, selectedKey])

  async function loadMarks(key) {
    setSelectedKey(key)
    if (!key) { setRows([]); return }
    const [type, id] = key.split(':')
    const res = await window.electronAPI.getMarksForAssessment({ type, id: Number(id), batchId: selectedBatch ? selectedBatch.id : null })
    const allRows = res.rows || []
    // store raw rows and let the UI compute filtering based on current selectedSection
    setRows(allRows)
  }

  const displayedRows = useMemo(() => {
    const normalize = (v) => (v || '').toString().trim().toUpperCase()
    if (selectedSection && selectedSection !== 'All Sections') {
      return rows.filter(r => normalize(r.section) === normalize(selectedSection))
    }
    return rows
  }, [rows, selectedSection])

  async function exportExcel() {
    const res = await window.electronAPI.exportExcel({ batchId: selectedBatch ? selectedBatch.id : null, batchName: selectedBatch ? selectedBatch.batch_name : null })
    if (!res.canceled) showToast('success', `Exported to ${res.path}`)
  }

  async function copyTable() {
    if (!selected) return
    let tsv = 'Roll No\tName\tSection\tObtained Marks\tTotal Marks\n'
    for (const r of displayedRows) {
      // If roll_no already contains batch (FAXX-), use it; otherwise prefix with section if available
      const fullRoll = r.roll_no && /FA\d{2}-/i.test(r.roll_no)
        ? r.roll_no
        : (r.section ? `${r.section}-${r.roll_no}` : r.roll_no)
      tsv += `${fullRoll}\t${r.name}\t${r.section ?? ''}\t${r.obtained_marks ?? ''}\t${selected.total_marks}\n`
    }
    await window.electronAPI.copyToClipboard(tsv)
    showToast('success', 'Copied to clipboard')
  }

  function exportFilteredCSV() {
    if (!selected) return
    let csv = 'Roll No,Name,Section,Obtained Marks,Total Marks\n'
    for (const r of displayedRows) {
      const fullRoll = r.roll_no && /FA\d{2}-/i.test(r.roll_no)
        ? r.roll_no
        : (r.section ? `${r.section}-${r.roll_no}` : r.roll_no)
      csv += `${fullRoll},${r.name},${r.section ?? ''},${r.obtained_marks ?? ''},${selected.total_marks}\n`
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'marks-export.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    showToast('success', 'Exported CSV')
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Export</h1>
          <p className="text-slate-600 mt-2">Preview and export marks</p>
        </div>
        <div className="flex gap-3">
          <BatchSelector />
          <SectionSelector />
          <button onClick={exportExcel} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <FileSpreadsheet size={20} />
            Export Excel
          </button>
          <button onClick={copyTable} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <Copy size={20} />
            Copy Table
          </button>
          <button onClick={exportFilteredCSV} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <Download size={20} />
            Export Filtered CSV
          </button>
        </div>
      </div>

      <hr className="mb-6 border-slate-200" />

      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700 mb-2 block">Select Assessment</label>
        <select value={selectedKey} onChange={(e) => loadMarks(e.target.value)} className="block border border-slate-300 px-4 py-3 rounded-xl w-full max-w-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm">
          <option value="">Select...</option>
          {assessments.map(a => (
            <option key={`${a.type}:${a.id}`} value={`${a.type}:${a.id}`}>
              {a.type === 'quiz' ? `Quiz ${a.id}: ${a.title}` : a.type === 'assignment' ? `Assignment ${a.id}: ${a.title}` : `Project ${a.id}: ${a.title}`}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-6 animate-pulse space-y-3">
            <div className="h-6 bg-slate-100 rounded"></div>
            <div className="h-6 bg-slate-100 rounded"></div>
          </div>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left font-semibold roll-no-cell">Roll No</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Section</th>
                <th className="px-4 py-3 text-left font-semibold">Obtained Marks</th>
                <th className="px-4 py-3 text-left font-semibold">Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.map((r, idx) => (
                <tr key={r.student_id} className={`border-t hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="px-6 py-4 font-bold text-slate-700 roll-no-cell">{r.roll_no}</td>
                  <td className="px-6 py-4 text-slate-700">{r.name}</td>
                  <td className="px-6 py-4 text-slate-700">{r.section}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {r.obtained_marks ?? ''}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
                      {selected?.total_marks ?? ''}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
