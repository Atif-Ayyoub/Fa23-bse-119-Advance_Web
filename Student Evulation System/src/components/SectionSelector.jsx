import React from 'react'
import { useStudents } from '../context/StudentsContext'

export default function SectionSelector({ className }) {
  const { sections, selectedSection, setSelectedSection } = useStudents()

  return (
    <div className={className}>
      <label className="text-sm font-medium text-slate-700 mr-2">Section</label>
      <select
        value={selectedSection}
        onChange={(e) => {
          console.log('SectionSelector: setSelectedSection ->', e.target.value)
          setSelectedSection(e.target.value)
        }}
        className="border px-3 py-2 rounded"
      >
        {sections.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  )
}
