import React, { useEffect, useMemo, useRef, useState } from 'react'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import AssessmentModal from '../components/AssessmentModal'
import SectionSelector from '../components/SectionSelector'
import BatchSelector from '../components/BatchSelector'
import { useStudents } from '../context/StudentsContext'
import { Users, ClipboardCheck, BookOpen, FileText, Target, Upload, Award } from 'lucide-react'

function StatCard({ label, value, icon: Icon, gradient }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} shadow-lg p-6 flex items-center justify-between min-w-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
      <div className="min-w-0">
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <h2 className="text-4xl font-bold text-white mt-2">{value}</h2>
      </div>
      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
        <Icon className="text-white" size={32} />
      </div>
    </div>
  )
}

function AssessmentList({ title, items, onOpen, uploadedMap = {}, sections = [] }) {
  const getIcon = () => {
    if (title === 'Quizzes') return <Target className="text-emerald-600" size={20} />;
    if (title === 'Assignments') return <FileText className="text-amber-600" size={20} />;
    return <Award className="text-indigo-600" size={20} />;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-3">
          {getIcon()}
          <span className="text-lg">{title}</span>
        </h3>
        <div className="text-sm text-slate-500">{items.length} items</div>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-slate-400 mt-4 flex items-center gap-2">
          <div className="px-2 py-1 bg-slate-100 rounded">ℹ️</div>
          <span className="italic">No items yet</span>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {items.map(item => {
            const type = title === 'Quizzes' ? 'quiz' : title === 'Assignments' ? 'assignment' : 'project';
            const displayTitle = type === 'quiz' ? `Quiz ${item.title}` : 
                                 type === 'assignment' ? `Assignment ${item.id}: ${item.title}` : 
                                 `Project ${item.id}: ${item.title}`;

            const key = `${type}:${item.id}`
            const uploadedSet = uploadedMap[key] || new Set()
            const totalSections = (sections || []).filter(s => s !== 'All Sections').length
            const disabledUpload = totalSections > 0 && uploadedSet.size >= totalSections

            return (
              <div key={item.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3 hover:shadow-sm transition-shadow duration-200 border border-slate-100">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800">{displayTitle}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>📅 {item.date}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">{item.total_marks} marks</span>
                  </div>
                </div>
                <button onClick={() => onOpen(item, true)} disabled={disabledUpload} className={`h-10 px-4 rounded-lg ${disabledUpload ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black'} transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2`}>
                  <Upload size={16} />
                  <span>Upload</span>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { students, loadStudents, selectedSection, sections, selectedBatch } = useStudents()
  const [assessments, setAssessments] = useState({ quizzes: [], assignments: [], projects: [] })
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loadingAssessments, setLoadingAssessments] = useState(true)
  
  const [marksModalOpen, setMarksModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [marksData, setMarksData] = useState([])
  const [marksModalAllStudents, setMarksModalAllStudents] = useState([])
  const [marksModalSection, setMarksModalSection] = useState('All Sections')
  const [marksModalSearch, setMarksModalSearch] = useState('')
  const [marksModalEditable, setMarksModalEditable] = useState(false)
  const [bulkValue, setBulkValue] = useState('')
  const [uploadedMap, setUploadedMap] = useState({}) // { 'quiz:1': Set(['FA22', ...]) }
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false)
  const [assessmentType, setAssessmentType] = useState('quiz')
  const [toast, setToast] = useState(null)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importSection, setImportSection] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => { loadAssessments(); }, [selectedBatch])

  function showToast(type, message) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  // students are provided by StudentsContext; use loadStudents() from there when needed

  async function loadAssessments() {
    setLoadingAssessments(true)
    const a = await window.electronAPI.getAssessments()
    setAssessments(a)
    // refresh uploadedMap for all assessments we loaded
    try {
      const promises = []
      for (const q of (a.quizzes || [])) promises.push(refreshUploadedSectionsForAssessment('quiz', q.id))
      for (const as of (a.assignments || [])) promises.push(refreshUploadedSectionsForAssessment('assignment', as.id))
      for (const p of (a.projects || [])) promises.push(refreshUploadedSectionsForAssessment('project', p.id))
      await Promise.all(promises)
    } catch (err) {
      console.error('Error refreshing uploadedMap for assessments', err)
    }
    setLoadingAssessments(false)
  }

  async function onImportPdf(e) {
    console.log('onImportPdf: File input triggered')
    
    const file = e.target.files[0]
    console.log('onImportPdf: Selected file:', file)
    
    if (!file) {
      console.log('onImportPdf: No file selected')
      showToast('error', 'No file selected')
      return
    }
    
    // In Electron, files have a path property. Check for it.
    const filePath = file.path
    console.log('onImportPdf: File path:', filePath)
    console.log('onImportPdf: File type:', file.type)
    console.log('onImportPdf: File name:', file.name)
    
    if (!filePath) {
      console.error('onImportPdf: File path not accessible. This might not be running in Electron.')
      showToast('error', 'Cannot access file path. Please ensure you are running the Electron app.')
      e.target.value = ''
      return
    }
    
    // Open import modal to ask for section (works in browser and Electron)
    setImportFile({ file, filePath })
    setImportSection('')
    setImportModalOpen(true)
    e.target.value = '' // reset input now; we'll keep file info in state
  }

  async function handleConfirmImport() {
    if (!importFile) return
    if (!importSection || importSection.trim() === '') {
      showToast('error', 'Section is required for import')
      return
    }

    try {
      showToast('info', 'Importing PDF...')
      console.log('\n=== FRONTEND: Starting PDF Import ===')
      console.log('File path:', importFile.filePath)
      console.log('Section:', importSection.trim())
      console.log('File name:', importFile.file.name)
      console.log('File size:', importFile.file.size, 'bytes')

      const parsed = await window.electronAPI.importPdf({ filePath: importFile.filePath, section: importSection.trim(), batchId: selectedBatch ? selectedBatch.id : null })

      console.log('\n=== FRONTEND: Import Complete ===')
      console.log('Parsed result:', parsed)

      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        console.log('SUCCESS: Reloading students...')
        await loadStudents()
        showToast('success', `✓ Imported ${parsed.length} students to section ${importSection.trim()}`)
      } else {
        console.warn('WARNING: No students were parsed from the PDF')
        showToast('error', '⚠ No students found in PDF. Check console for details.')
      }
    } catch (error) {
      console.error('\n=== FRONTEND: Import Error ===')
      console.error('Error:', error)
      showToast('error', `Import failed: ${error.message || 'Unknown error'}`)
    } finally {
      setImportModalOpen(false)
      setImportFile(null)
      setImportSection('')
    }
  }

  function handleCancelImport() {
    setImportModalOpen(false)
    setImportFile(null)
    setImportSection('')
  }

  async function onExportExcel() {
    const res = await window.electronAPI.exportExcel({ batchId: selectedBatch ? selectedBatch.id : null, batchName: selectedBatch ? selectedBatch.batch_name : null })
    if (!res.canceled) showToast('success', `Exported to ${res.path}`)
  }

  async function copyTable() {
    const filtered = selectedSection && selectedSection !== 'All Sections'
      ? students.filter(s => (s.section || '') === selectedSection)
      : students
    let tsv = 'Roll No\tName\tSection\n'
    for (const s of filtered) tsv += `${s.roll_no}\t${s.name}\t${s.section}\n`
    await window.electronAPI.copyToClipboard(tsv)
    showToast('success', 'Copied to clipboard')
  }

  const openMarksModal = async (assessment, type, editable = false) => {
    setSelectedAssessment({ ...assessment, type })
    // set editable according to caller (default: read-only)
    setMarksModalEditable(Boolean(editable))
    // load students for the modal (use latest from backend)
    const studs = await window.electronAPI.getStudents(selectedBatch ? selectedBatch.id : null)
    setMarksModalAllStudents(studs || [])
    // default modal section to current global selection when opening
    setMarksModalSection(selectedSection || 'All Sections')
    // initialize marksData based on selected section
    const base = (selectedSection && selectedSection !== 'All Sections')
      ? (studs || []).filter(s => (s.section || '') === selectedSection)
      : (studs || [])
    setMarksData(base.map(st => ({ student_id: st.id, name: st.name, obtained_marks: '' , roll_no: st.roll_no, section: st.section })))
    setBulkValue('')
    setMarksModalSearch('')
    setMarksModalOpen(true)
    // refresh uploaded sections state for this assessment
    try {
      await refreshUploadedSectionsForAssessment(type, assessment.id)
    } catch (err) {
      console.error('refreshUploadedSectionsForAssessment error', err)
    }
  }

  // Listen for cross-page requests to open the marks modal
  useEffect(() => {
    const handler = (e) => {
      const d = e?.detail || {}
      const assessment = d.assessment
      const type = d.type || (assessment && assessment.type)
      const editable = typeof d.editable !== 'undefined' ? Boolean(d.editable) : false
      if (assessment) openMarksModal(assessment, type, editable)
    }
    window.addEventListener('evaldesk:open-marks-modal', handler)
    return () => window.removeEventListener('evaldesk:open-marks-modal', handler)
  }, [marksModalAllStudents, selectedSection])

  const handleMarkChange = (studentId, value) => {
    setMarksData(prev => prev.map(m => m.student_id === studentId ? { ...m, obtained_marks: value === '' ? '' : Number(value) } : m))
  }

  const giveSameMarks = (value) => {
    setBulkValue(value)
    const v = value === '' ? '' : Number(value)
    setMarksData(prev => prev.map(m => ({ ...m, obtained_marks: v })))
  }

  async function refreshUploadedSectionsForAssessment(type, id) {
    try {
      const res = await window.electronAPI.getMarksForAssessment({ type, id, batchId: selectedBatch ? selectedBatch.id : null })
      const rows = res.rows || []
      const bySection = {}
      for (const r of rows) {
        const sec = (r.section || '').toString()
        if (!bySection[sec]) bySection[sec] = []
        bySection[sec].push(r)
      }
      const uploaded = new Set()
      for (const sec of Object.keys(bySection)) {
        if (!sec) continue
        const allHave = bySection[sec].every(r => r.obtained_marks !== null && r.obtained_marks !== '' && typeof r.obtained_marks !== 'undefined')
        if (allHave) uploaded.add(sec)
      }
      setUploadedMap(prev => ({ ...prev, [`${type}:${id}`]: uploaded }))
      return uploaded
    } catch (err) {
      console.error('refreshUploadedSectionsForAssessment failed', err)
      return new Set()
    }
  }

  // when modal section or loaded students change, rebuild marksData list for modal
  useEffect(() => {
    if (!marksModalAllStudents) return
    const normalize = (v) => (v || '').toString().trim().toUpperCase()
    const base = marksModalSection && marksModalSection !== 'All Sections'
      ? marksModalAllStudents.filter(s => normalize(s.section) === normalize(marksModalSection))
      : marksModalAllStudents
    setMarksData(base.map(st => ({ student_id: st.id, name: st.name, obtained_marks: '', roll_no: st.roll_no, section: st.section })))
  }, [marksModalSection, marksModalAllStudents])

  const filteredMarks = useMemo(() => {
    const q = (marksModalSearch || '').trim().toLowerCase()
    if (!q) return marksData
    return marksData.filter(m => `${m.roll_no} ${m.name}`.toLowerCase().includes(q))
  }, [marksData, marksModalSearch])

  const saveMarks = async () => {
    if (!selectedAssessment) return
    for (const m of marksData) {
      if (m.obtained_marks === '') continue
      if (m.obtained_marks > selectedAssessment.total_marks) {
        showToast('error', `Marks cannot exceed total (${selectedAssessment.total_marks})`)
        return
      }
    }

    const payload = {
      assessment_type: selectedAssessment.type,
      assessment_id: selectedAssessment.id,
      marks: marksData.map(m => ({ student_id: m.student_id, obtained_marks: m.obtained_marks })),
      total_marks: selectedAssessment.total_marks
    }

    const res = await window.electronAPI.saveMarks(payload)
    if (res && res.success) {
      showToast('success', 'Marks saved successfully')
      setMarksModalOpen(false)
      await loadStudents()
      // refresh uploaded sections for this assessment
      try {
        const newUploaded = await refreshUploadedSectionsForAssessment(selectedAssessment.type, selectedAssessment.id)
        const sectionUploaded = newUploaded.has(marksModalSection)
        if (sectionUploaded) showToast('success', `Marks for ${marksModalSection} section uploaded`)
        const totalSections = (sections || []).filter(s => s !== 'All Sections').length
        if (newUploaded.size >= totalSections && totalSections > 0) {
          showToast('success', 'All sections uploaded')
        }
      } catch (err) {
        console.error('Error refreshing uploaded sections after save', err)
      }
    } else {
      showToast('error', res.message || 'Failed to save marks')
    }
  }

  function openAssessmentModal(type) {
    setAssessmentType(type)
    setAssessmentModalOpen(true)
  }

  async function saveAssessment(form) {
    if (!form.title || !form.date || !form.total_marks) {
      showToast('error', 'Please fill all fields')
      return
    }
    const payload = {
      type: assessmentType,
      title: form.title,
      date: form.date,
      total_marks: Number(form.total_marks)
    }
    const res = await window.electronAPI.addAssessment(payload)
    if (res.success) {
      showToast('success', 'Assessment added')
      setAssessmentModalOpen(false)
      loadAssessments()
    } else {
      showToast('error', res.message || 'Failed to add assessment')
    }
  }

  const totalAssessments = useMemo(() => {
    return assessments.quizzes.length + assessments.assignments.length + assessments.projects.length
  }, [assessments])

  const filteredStudents = useMemo(() => {
    return selectedSection && selectedSection !== 'All Sections'
      ? students.filter(s => (s.section || '') === selectedSection)
      : students
  }, [students, selectedSection])

  const currentAssessmentKey = selectedAssessment ? `${selectedAssessment.type}:${selectedAssessment.id}` : null
  const currentUploadedSet = currentAssessmentKey ? (uploadedMap[currentAssessmentKey] || new Set()) : new Set()
  const isSectionUploaded = marksModalSection && currentUploadedSet.has(marksModalSection)

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Teacher Dashboard</h1>
          <p className="text-slate-600 mt-2">Track quizzes, assignments, and semester projects in one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <input ref={fileInputRef} type="file" className="hidden" accept="application/pdf" onChange={onImportPdf} />
          <button 
            onClick={() => {
              console.log('Import PDF button clicked')
              console.log('File input ref:', fileInputRef.current)
              if (fileInputRef.current) {
                fileInputRef.current.click()
              } else {
                console.error('File input ref is null')
                showToast('error', 'File input not available')
              }
            }} 
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Import PDF
          </button>
          <button onClick={onExportExcel} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">Export Excel</button>
          <button onClick={copyTable} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">Copy Table</button>
        </div>
      </div>

      <hr className="mb-6 border-slate-200" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Students" value={filteredStudents.length} icon={Users} gradient="from-blue-500 to-blue-600" />
        <StatCard label="Total Assessments" value={totalAssessments} icon={ClipboardCheck} gradient="from-purple-500 to-purple-600" />
        <StatCard label="Quizzes" value={assessments.quizzes.length} icon={Target} gradient="from-emerald-500 to-emerald-600" />
        <StatCard label="Assignments" value={assessments.assignments.length} icon={BookOpen} gradient="from-amber-500 to-amber-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-6">
              <h2 className="font-bold text-xl text-slate-800">Assessments</h2>
              <div className="mt-4 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <button onClick={() => openAssessmentModal('quiz')} className="w-full sm:w-auto h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 flex items-center justify-center">+ Quiz</button>
                <button onClick={() => openAssessmentModal('assignment')} className="w-full sm:w-auto h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 flex items-center justify-center">+ Assignment</button>
                <button onClick={() => openAssessmentModal('project')} className="w-full sm:w-auto h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 flex items-center justify-center">+ Project</button>
              </div>
            </div>

          {loadingAssessments ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-6 bg-slate-100 rounded"></div>
              <div className="h-6 bg-slate-100 rounded"></div>
              <div className="h-6 bg-slate-100 rounded"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <AssessmentList title="Quizzes" items={(assessments.quizzes || []).filter(it => {
                const key = `quiz:${it.id}`
                const uploadedSet = uploadedMap[key] || new Set()
                const totalSections = (sections || []).filter(s => s !== 'All Sections').length
                return !(totalSections > 0 && uploadedSet.size >= totalSections)
              })} onOpen={(q, editable) => openMarksModal(q, 'quiz', editable)} uploadedMap={uploadedMap} sections={sections} />

              <AssessmentList title="Assignments" items={(assessments.assignments || []).filter(it => {
                const key = `assignment:${it.id}`
                const uploadedSet = uploadedMap[key] || new Set()
                const totalSections = (sections || []).filter(s => s !== 'All Sections').length
                return !(totalSections > 0 && uploadedSet.size >= totalSections)
              })} onOpen={(a, editable) => openMarksModal(a, 'assignment', editable)} uploadedMap={uploadedMap} sections={sections} />

              <AssessmentList title="Projects" items={(assessments.projects || []).filter(it => {
                const key = `project:${it.id}`
                const uploadedSet = uploadedMap[key] || new Set()
                const totalSections = (sections || []).filter(s => s !== 'All Sections').length
                return !(totalSections > 0 && uploadedSet.size >= totalSections)
              })} onOpen={(p, editable) => openMarksModal(p, 'project', editable)} uploadedMap={uploadedMap} sections={sections} />
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-xl text-slate-800">Students</h2>
              <p className="text-sm text-slate-500 mt-1">{filteredStudents.length} records</p>
            </div>
                <div className="flex items-center gap-3">
                  <BatchSelector />
                  <SectionSelector />
                </div>
          </div>

          {loadingStudents ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-6 bg-slate-100 rounded"></div>
              <div className="h-6 bg-slate-100 rounded"></div>
              <div className="h-6 bg-slate-100 rounded"></div>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-96 rounded-xl border border-slate-200">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold roll-no-cell">Roll No</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Section</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s, idx) => (
                    <tr key={s.id} className={`border-t hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      <td className="px-4 py-3 font-semibold text-slate-700 roll-no-cell">{s.roll_no}</td>
                      <td className="px-4 py-3 text-slate-700">{s.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {s.section}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal open={marksModalOpen} title={`Enter Marks: ${selectedAssessment?.title} (Total: ${selectedAssessment?.total_marks})`} onClose={() => setMarksModalOpen(false)}>
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="col-span-1 sm:col-span-2 flex items-center gap-3">
            <label className="text-sm">Give same marks to all:</label>
            <input
              type="number"
              value={bulkValue}
              onChange={(e) => giveSameMarks(e.target.value)}
              max={selectedAssessment?.total_marks}
              className="border px-3 py-2 rounded-lg w-28"
              disabled={!marksModalEditable}
            />
          </div>
          <div className="flex items-center gap-2">
            <select value={marksModalSection} onChange={(e) => setMarksModalSection(e.target.value)} className="border px-3 py-2 rounded w-full">
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-1 sm:col-span-3 mt-2">
            <input value={marksModalSearch} onChange={(e) => setMarksModalSearch(e.target.value)} placeholder="Search students" className="w-full border px-3 py-2 rounded" />
          </div>
        </div>

        <table className="min-w-full table-auto mb-4">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left">Roll No</th>
              <th className="px-4 py-2 text-left">Student</th>
              <th className="px-4 py-2 text-left">Section</th>
              <th className="px-4 py-2 text-left">Marks</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarks.map((m, idx) => (
              <tr key={m.student_id} className="border-t">
                <td className="px-4 py-2 font-semibold text-slate-700">{m.roll_no}</td>
                <td className="px-4 py-2">{m.name}</td>
                <td className="px-4 py-2">{m.section}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={m.obtained_marks}
                    onChange={(e) => handleMarkChange(m.student_id, e.target.value)}
                    max={selectedAssessment?.total_marks}
                    className="border px-3 py-2 rounded-lg w-28"
                    disabled={!marksModalEditable}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end gap-2 items-center">
          {isSectionUploaded && (
            <div className="text-sm text-rose-600 mr-2">Marks already uploaded for {marksModalSection}</div>
          )}
          <button onClick={() => setMarksModalOpen(false)} className="px-3 py-2 rounded-lg border">Cancel</button>
          <button disabled={!marksModalEditable || isSectionUploaded} onClick={saveMarks} className={`px-3 py-2 rounded-lg ${(!marksModalEditable || isSectionUploaded) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white'}`}>Save Marks</button>
        </div>
      </Modal>

      {/* Password prompt removed — Upload now opens modal in editable mode */}

      <AssessmentModal
        open={assessmentModalOpen}
        onClose={() => setAssessmentModalOpen(false)}
        onSave={saveAssessment}
        initial={{ type: assessmentType }}
        allowTypeSelect={false}
      />

      <Modal open={importModalOpen} title="Import PDF - Enter Section" onClose={handleCancelImport}>
        <div>
          <p className="text-sm text-slate-600 mb-3">Selected file: {importFile?.file?.name || ''}</p>
          <label className="text-sm text-slate-600">Section</label>
          <input value={importSection} onChange={(e) => setImportSection(e.target.value)} placeholder="e.g. FA23" className="w-full border px-3 py-2 rounded-lg mb-4" />
          <div className="flex justify-end gap-2">
            <button onClick={handleCancelImport} className="px-3 py-2 rounded-lg border">Cancel</button>
            <button onClick={handleConfirmImport} className="px-3 py-2 rounded-lg bg-slate-900 text-white">Import</button>
          </div>
        </div>
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
