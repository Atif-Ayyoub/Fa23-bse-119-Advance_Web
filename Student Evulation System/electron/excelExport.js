const ExcelJS = require('exceljs');
const db = require('./database');

async function exportToExcel(filePath, batchId = null, batchName = null) {
  const { students, assessments, marksRows } = db.fetchEvaluationData(batchId);
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Evaluations');

  // Insert batch title if provided
  if (batchName) {
    const titleRow = ws.addRow([`Batch: ${batchName}`]);
    titleRow.font = { bold: true };
    ws.addRow([]);
  }

  // Build headers: Roll No, Name, Section, then dynamic columns
  const header = ['Roll No', 'Name', 'Section'];
  const cols = [];
  let colIndex = 4;

  const namedAssess = [];
  for (const q of assessments.quizzes) { 
    namedAssess.push({ 
      key: `quiz_${q.id}`, 
      title: `Quiz ${q.id}: ${q.title}`,
      totalMarks: q.total_marks 
    }); 
  }
  for (const a of assessments.assignments) { 
    namedAssess.push({ 
      key: `assignment_${a.id}`, 
      title: `Assignment ${a.id}: ${a.title}`,
      totalMarks: a.total_marks 
    }); 
  }
  for (const p of assessments.projects) { 
    namedAssess.push({ 
      key: `project_${p.id}`, 
      title: `Project ${p.id}: ${p.title}`,
      totalMarks: p.total_marks 
    }); 
  }

  const finalHeader = header.concat(namedAssess.map(n => n.title));
  const headerRow = ws.addRow(finalHeader);
  
  // Make header bold
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE2E8F0' }
  };

  // Add total marks row
  const totalMarksRow = ws.addRow(['', '', 'Total Marks'].concat(namedAssess.map(n => n.totalMarks)));
  totalMarksRow.font = { italic: true, color: { argb: 'FF475569' } };
  totalMarksRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF1F5F9' }
  };

  for (const s of students) {
    const row = [s.roll_no, s.name, s.section];
    for (const n of namedAssess) {
      // parse key
      const parts = n.key.split('_');
      const type = parts[0];
      const id = parseInt(parts[1], 10);
      const mark = marksRows.find(m => m.student_id === s.id && m.assessment_type === type && m.assessment_id === id);
      row.push(mark ? mark.obtained_marks : '');
    }
    ws.addRow(row);
  }

  // Add borders to all cells
  ws.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Auto-adjust column widths
  ws.columns.forEach(column => {
    column.width = 20;
  });

  await wb.xlsx.writeFile(filePath);
}

module.exports = { exportToExcel };
