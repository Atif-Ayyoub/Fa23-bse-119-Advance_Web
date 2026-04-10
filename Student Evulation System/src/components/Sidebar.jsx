import React, { useEffect, useMemo, useState } from 'react'
import { LayoutDashboard, Users, ClipboardList, FileDown, GraduationCap, CheckCircle, X } from 'lucide-react'
import { useStudents } from '../context/StudentsContext'

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'assessments', label: 'Assessments', icon: ClipboardList },
  { id: 'marks', label: 'Marks', icon: CheckCircle },
  { id: 'export', label: 'Export', icon: FileDown }
]

export default function Sidebar({ activePage, onNavigate, open = false, onClose = () => {} }) {
  const { sections, selectedBatch } = useStudents()
  const [assessments, setAssessments] = useState({ quizzes: [], assignments: [], projects: [] })
  const [completedMap, setCompletedMap] = useState({}) // { 'quiz:1': true }
  const [hiddenKeys, setHiddenKeys] = useState(() => {
    try {
      const raw = localStorage.getItem('sidebarHiddenAssessments')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const a = await window.electronAPI.getAssessments()
        if (!mounted) return
        setAssessments(a || { quizzes: [], assignments: [], projects: [] })
      } catch (err) {
        console.error('Sidebar: failed to load assessments', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    // compute completed map for assessments
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
            console.error('Sidebar: error checking assessment', it, err)
          }
        }))
        if (mounted) setCompletedMap(map)
      } catch (err) {
        console.error('Sidebar: compute failed', err)
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
  const isHidden = (key) => (hiddenKeys || []).includes(key)

  const displayTitle = (it) => {
    if (it.type === 'quiz') return `Quiz ${it.title}`
    if (it.type === 'assignment') return `Assignment ${it.id}: ${it.title}`
    return `Project ${it.id}: ${it.title}`
  }

  const hideKey = (key) => {
    try {
      const next = Array.from(new Set([...(hiddenKeys || []), key]))
      setHiddenKeys(next)
      localStorage.setItem('sidebarHiddenAssessments', JSON.stringify(next))
    } catch (e) {
      console.error('Sidebar: failed to hide key', e)
    }
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} aria-hidden={!open}></div>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 px-6 py-8 shadow-2xl md:shadow-none transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:translate-y-0 md:top-0 md:h-screen`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
          <GraduationCap size={24} className="text-white" />
        </div>
        <div>
          <div className="text-xl font-bold tracking-wide">EvalDesk</div>
          <div className="text-xs text-slate-400">Evaluation Suite</div>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/50 text-white transform scale-105' 
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:translate-x-1'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-10 text-xs text-slate-500 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Academic Year 2026
      </div>
      </aside>
    </>
  )
}
