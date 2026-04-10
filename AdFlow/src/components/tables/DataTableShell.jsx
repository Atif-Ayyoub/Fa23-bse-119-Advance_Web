import { m } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../animations/variants'

export function DataTableShell({ columns = [], rows = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50/90">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 text-left font-semibold text-slate-700">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <m.tbody variants={staggerContainer} initial="hidden" animate="visible" className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <m.tr key={`${index}`} variants={staggerItem}>
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="px-4 py-3 text-slate-600">
                  {cell}
                </td>
              ))}
            </m.tr>
          ))}
        </m.tbody>
      </table>
    </div>
  )
}
