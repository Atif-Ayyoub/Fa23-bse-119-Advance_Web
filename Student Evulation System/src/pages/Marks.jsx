import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { useStudents } from '../context/StudentsContext'
import AssessmentModal from '../components/AssessmentModal'
import AssessmentViewModal from '../components/AssessmentViewModal'

export default function Marks() {
  const { sections, selectedBatch } = useStudents()
  const [assessments, setAssessments] = useState({ quizzes: [], assignments: [], projects: [] })
  const [completedMap, setCompletedMap] = useState({})
  const [viewAssessment, setViewAssessment] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const a = await window.electronAPI.getAssessments()
        if (!mounted) return
        setAssessments(a || { quizzes: [], assignments: [], projects: [] })
      } catch (err) {
        console.error('Marks: failed to load assessments', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    async function compute() {
      try {
        const totalSections = (sections || []).filter(s => s !== 'All Sections').length
        const all = []
        for (const q of (assessments.quizzes || [])) all.push({ ...q, type: 'quiz' })
        for (const a of (assessments.assignments || [])) all.push({ ...a, type: 'assignment' })
        for (const p of (assessments.projects || [])) all.push({ ...p, type: 'project' })

        const map = {}
        await Promise.all(all.map(async it => {
          try {
            const res = await window.electronAPI.getMarksForAssessment({ type: it.type, id: it.id, batchId: selectedBatch ? selectedBatch.id : null })
            const rows = res.rows || []
            const bySection = {}
            for (const r of rows) {
              const sec = (r.section || '').toString()
              if (!bySection[sec]) bySection[sec] = []
              bySection[sec].push(r)
            }
            let uploadedCount = 0
            for (const sec of Object.keys(bySection)) {
              if (!sec) continue
              const allHave = bySection[sec].every(r => r.obtained_marks !== null && r.obtained_marks !== '' && typeof r.obtained_marks !== 'undefined')
              if (allHave) uploadedCount++
            }
            const completed = totalSections > 0 && uploadedCount >= totalSections
            map[`${it.type}:${it.id}`] = completed
          } catch (err) {
            console.error('Marks: error checking assessment', it, err)
          }
        }))
        if (mounted) setCompletedMap(map)
      } catch (err) {
        console.error('Marks: compute failed', err)
      }
    }
    compute()
    return () => { mounted = false }
  }, [assessments, sections, selectedBatch])

  const flattened = useMemo(() => {
    const all = []
    for (const q of (assessments.quizzes || [])) all.push({ ...q, type: 'quiz' })
    for (const a of (assessments.assignments || [])) all.push({ ...a, type: 'assignment' })
    for (const p of (assessments.projects || [])) all.push({ ...p, type: 'project' })
    return all
  }, [assessments])

  const notUploaded = flattened.filter(it => !completedMap[`${it.type}:${it.id}`])
  const uploaded = flattened.filter(it => completedMap[`${it.type}:${it.id}`])

  const displayTitle = (it) => {
    if (it.type === 'quiz') return `Quiz ${it.title}`
    if (it.type === 'assignment') return `Assignment ${it.id}: ${it.title}`
    return `Project ${it.id}: ${it.title}`
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Marks</h1>

      <section className="mb-6">
        <div className="text-sm text-slate-500 mb-2">Pending Uploads</div>
        {notUploaded.length === 0 && <div className="text-sm text-slate-400">All assessments have marks uploaded.</div>}
        <div className="space-y-2">
          {notUploaded.map(it => (
            <button key={`${it.type}:${it.id}`} onClick={() => {
              // ask App to navigate to dashboard and open marks modal for this assessment
              window.dispatchEvent(new CustomEvent('evaldesk:open-marks', { detail: { action: 'open-marks', assessment: it, type: it.type } }))
            }} className="w-full text-left flex items-center justify-between bg-white rounded shadow-sm p-3">
              <div className="min-w-0 truncate">{displayTitle(it)}</div>
              <div className="text-sm text-rose-600">Open</div>
            </button>
          ))}
        </div>
      </section>

      <AssessmentViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        assessment={viewAssessment}
        onRequestEdit={() => { setEditModalOpen(true); setViewModalOpen(false) }}
      />

      {/* Password prompt removed — editing opens directly from View */}

      <AssessmentModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initial={viewAssessment}
        allowTypeSelect={true}
        onSave={async (form) => {
          try {
            const payload = { ...form, id: viewAssessment.id }
            const res = await window.electronAPI.updateAssessment(payload)
            if (res && res.success) {
              setEditModalOpen(false)
              // reload assessments list
              const a = await window.electronAPI.getAssessments()
              setAssessments(a)
              alert('Assessment updated')
            } else {
              alert(res?.message || 'Failed to update assessment')
            }
          } catch (err) {
            console.error('Update assessment error', err)
            alert('Error updating assessment')
          }
        }}
      />

      <section className="mt-8">
        <div className="text-sm text-slate-500 mb-2">Uploaded</div>
        <div className="space-y-2">
          {uploaded.map(it => (
            <div key={`${it.type}:${it.id}`} className="flex items-center justify-between bg-white rounded shadow-sm p-3">
              <div className="min-w-0 truncate">{displayTitle(it)}</div>
              <div className="flex items-center gap-3">
                <button onClick={() => {
                  // Open marks modal in Dashboard (read-only by default)
                  window.dispatchEvent(new CustomEvent('evaldesk:open-marks', { detail: { action: 'open-marks', assessment: it, type: it.type } }))
                }} className="text-sm text-slate-700 px-3 py-1 rounded border">Open</button>
                <CheckCircle size={18} className="text-emerald-500" />
              </div>
            </div>
          ))}
          {uploaded.length === 0 && <div className="text-sm text-slate-400">No uploaded assessments yet.</div>}
        </div>
      </section>
    </div>
  )
}
