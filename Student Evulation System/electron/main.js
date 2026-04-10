const { app, BrowserWindow, ipcMain, dialog, clipboard } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const db = require('./database');
const pdfParser = require('./pdfParser');
const excelExport = require('./excelExport');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

app.whenReady().then(async () => {
  await db.init();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
ipcMain.handle('db:getStudents', async (_, batchId) => {
  return db.getStudents(batchId || null);
});

ipcMain.handle('db:getBatches', async () => {
  return db.getBatches();
});

ipcMain.handle('db:createBatch', async (_, name) => {
  return db.createBatch(name);
});

ipcMain.handle('db:getAssessments', async () => {
  return db.getAssessments();
});

ipcMain.handle('db:addAssessment', async (_, payload) => {
  // payload: { type: 'quiz'|'assignment'|'project', title, date, total_marks }
  try {
    const res = db.addAssessment(payload.type, payload);
    return { success: true, id: res.id };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

ipcMain.handle('db:updateAssessment', async (_, payload) => {
  try {
    db.updateAssessment(payload.type, payload);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

ipcMain.handle('db:deleteAssessment', async (_, payload) => {
  try {
    db.deleteAssessment(payload.type, payload.id);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

ipcMain.handle('db:addStudent', async (_, payload) => {
  try {
    db.addStudent(payload);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

ipcMain.handle('db:updateStudent', async (_, payload) => {
  try {
    db.updateStudent(payload);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

ipcMain.handle('db:deleteStudent', async (_, id) => {
  try {
    db.deleteStudent(id);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

ipcMain.handle('db:getMarksForAssessment', async (_, payload) => {
  try {
    const rows = db.getMarksForAssessment(payload.type, payload.id, payload.batchId || null);
    return { success: true, rows };
  } catch (err) {
    return { success: false, message: err.message, rows: [] };
  }
});

ipcMain.handle('pdf:import', async (_, payload) => {
  try {
    console.log('\n========================================');
    console.log('IPC: pdf:import called');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const { filePath, section } = payload;
    
    if (!filePath) {
      const error = new Error('No file path provided in payload');
      console.error('IPC: pdf:import - ERROR:', error.message);
      console.log('========================================\n');
      throw error;
    }
    
    if (!section || section.trim() === '') {
      const error = new Error('No section provided in payload');
      console.error('IPC: pdf:import - ERROR:', error.message);
      console.log('========================================\n');
      throw error;
    }
    
    console.log('IPC: Parsing PDF:', filePath);
    console.log('IPC: Target section:', section);
    
    const parsed = await pdfParser.parsePdf(filePath);
    
    console.log('\nIPC: Parse complete');
    console.log('IPC: Students parsed:', parsed ? parsed.length : 0);
    
    if (!parsed || !Array.isArray(parsed)) {
      const error = new Error('PDF parser returned invalid data (not an array)');
      console.error('IPC: pdf:import - ERROR:', error.message);
      console.log('========================================\n');
      throw error;
    }
    
    if (parsed.length === 0) {
      console.warn('IPC: WARNING - No students parsed from PDF');
      console.warn('IPC: This could mean:');
      console.warn('  1. The PDF format is not recognized');
      console.warn('  2. The PDF contains no valid student records');
      console.warn('  3. The parsing patterns need adjustment');
      console.log('========================================\n');
      return [];
    }
    
    // Apply import section (class) but preserve batch (FAxx) from parsed data by
    // combining it with roll_no so the stored roll_no includes the batch prefix.
    const studentsWithSection = parsed.map(student => {
      const parsedBatch = (student.section || '').toString().replace('-', '').trim().toUpperCase();
      // Normalize baseRoll: uppercase, trim, strip leading/trailing spaces or dashes
      let baseRoll = (student.roll_no || '').toUpperCase().trim().replace(/^[-\s]+/, '').replace(/[-\s]+$/, '');

      // If baseRoll already contains the batch (e.g. "FA22-BSE-098"), use it as-is.
      // Otherwise, if we have a parsed batch, prefix it (e.g. "FA22" + "-BSE-098").
      let fullRoll = baseRoll;
      if (!/^FA\d{2}-/i.test(baseRoll) && parsedBatch) {
        fullRoll = `${parsedBatch}-${baseRoll}`;
      }

      return {
        roll_no: fullRoll,
        name: student.name || '',
        section: section.trim().replace("-", ""), // user-provided class/section
        email: student.email || '',
        batch_id: payload.batchId || null
      };
    });
    
    console.log('\nIPC: Inserting', studentsWithSection.length, 'students into database');
    console.log('IPC: Sample student:', studentsWithSection[0]);
    
    try {
      await db.insertStudents(studentsWithSection);
      console.log('IPC: ✓ Students inserted successfully');
      console.log('========================================\n');
      return studentsWithSection;
    } catch (dbError) {
      console.error('\nIPC: DATABASE ERROR during student insertion');
      console.error('Error:', dbError.message);
      console.error('Stack:', dbError.stack);
      console.log('========================================\n');
      throw new Error(`Database error: ${dbError.message}`);
    }
    
  } catch (err) {
    console.error('\n========================================');
    console.error('IPC: pdf:import - FATAL ERROR');
    console.error('Error type:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.log('========================================\n');
    throw err;
  }
});

ipcMain.handle('marks:save', async (_, payload) => {
  // payload: {assessment_type, assessment_id, marks: [{student_id, obtained_marks}], total_marks}
  return db.saveMarks(payload);
});

// Backwards-compatible handler name 'save-marks' (some frontends/tools may use this)
ipcMain.handle('save-marks', async (event, { marks, totalMarks, assessment_type, assessment_id }) => {
  // adapt to db.saveMarks signature
  const payload = { assessment_type, assessment_id, marks, total_marks: totalMarks };
  const res = db.saveMarks(payload);
  return res;
});

ipcMain.handle('excel:export', async (_, opts) => {
  const savePath = await dialog.showSaveDialog({
    title: 'Export Excel',
    defaultPath: `student-evaluation${opts && opts.batchName ? `-${opts.batchName}` : ''}.xlsx`,
    filters: [{ name: 'Excel', extensions: ['xlsx'] }]
  });
  if (savePath.canceled) return { canceled: true };
  await excelExport.exportToExcel(savePath.filePath, opts && opts.batchId ? opts.batchId : null, opts && opts.batchName ? opts.batchName : null);
  return { canceled: false, path: savePath.filePath };
});

ipcMain.handle('db:bulkUpdateSection', async (_, payload) => {
  try {
    console.log('Bulk update section called with:', payload);
    const res = db.bulkUpdateSection(payload.studentIds, payload.section);
    console.log('Bulk update section result:', res);
    return res;
  } catch (err) {
    console.error('Bulk update section error:', err);
    return { success: false, message: err.message };
  }
});

ipcMain.handle('db:clearAllData', async () => {
  try {
    console.log('IPC: db:clearAllData called');
    const res = db.clearAllData();
    console.log('IPC: db:clearAllData result:', res);
    return res;
  } catch (err) {
    console.error('IPC: db:clearAllData error:', err);
    return { success: false, message: err.message };
  }
});

ipcMain.handle('clipboard:copy', async (_, tsv) => {
  clipboard.writeText(tsv);
  return true;
});
