const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

let SQL;
let db = null;
let DB_PATH = path.join(__dirname, '..', 'database.sqlite');

function persist() {
  const data = db.export();
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

async function init() {
  SQL = await initSqlJs();

  // choose DB path depending on packaged state (use userData when packaged)
  let packaged = false;
  try {
    const { app } = require('electron');
    packaged = app.isPackaged;
    if (packaged) {
      DB_PATH = path.join(app.getPath('userData'), 'database.sqlite');
    } else {
      DB_PATH = path.join(__dirname, '..', 'database.sqlite');
    }
  } catch (e) {
    DB_PATH = path.join(__dirname, '..', 'database.sqlite');
  }

  let exists = fs.existsSync(DB_PATH);

  // If packaged and DB doesn't exist yet, seed from resources if present
  if (!exists && packaged) {
    try {
      const { app } = require('electron');
      const resPath = path.join(process.resourcesPath, 'database.sqlite');
      if (fs.existsSync(resPath)) {
        fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
        fs.copyFileSync(resPath, DB_PATH);
        exists = true;
      }
    } catch (e) { /* ignore */ }
  }

  if (exists) {
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(new Uint8Array(filebuffer));
  } else {
    db = new SQL.Database();
  }

  // Ensure foreign keys if supported
  try { db.exec('PRAGMA foreign_keys = ON;'); } catch (e) { /* ignore */ }

  if (!exists) {
    createSchema();
    insertSampleData();
    persist();
  }
}

function createSchema() {
  const ddl = `
    CREATE TABLE IF NOT EXISTS batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_name TEXT UNIQUE,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roll_no TEXT UNIQUE,
      name TEXT,
      section TEXT,
      email TEXT,
      batch_id INTEGER,
      FOREIGN KEY(batch_id) REFERENCES batches(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      date TEXT,
      total_marks INTEGER
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      date TEXT,
      total_marks INTEGER
    );

    CREATE TABLE IF NOT EXISTS semester_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      date TEXT,
      total_marks INTEGER
    );

    CREATE TABLE IF NOT EXISTS marks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      assessment_type TEXT NOT NULL,
      assessment_id INTEGER NOT NULL,
      obtained_marks INTEGER NOT NULL,
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
      UNIQUE(student_id, assessment_type, assessment_id)
    );
  `;

  db.exec(ddl);
}

function insertSampleData() {
  const batches = [ ['Sp26'], ['Sp27'] ];
  const students = [
    ['CS001', 'Alice Johnson', 'A', 'alice@example.com', 'Sp26'],
    ['CS002', 'Bob Smith', 'A', 'bob@example.com', 'Sp26'],
    ['CS003', 'Charlie Lee', 'B', 'charlie@example.com', 'Sp27']
  ];

  const quizzes = [
    ['Quiz 1', '2026-02-01', 10],
    ['Quiz 2', '2026-02-15', 10]
  ];
  const assignments = [
    ['Assignment 1', '2026-02-10', 20]
  ];
  const projects = [
    ['Semester Project', '2026-03-01', 50]
  ];

  db.exec('BEGIN TRANSACTION;');
  const bStmt = db.prepare('INSERT OR IGNORE INTO batches (batch_name, created_at) VALUES (?, ?)');
  for (const b of batches) bStmt.run([b[0], new Date().toISOString()]);
  bStmt.free();

  // resolve batch ids
  const batchMap = {};
  const allBatches = stmtAll('SELECT * FROM batches');
  for (const b of allBatches) batchMap[b.batch_name] = b.id;

  const sStmt = db.prepare('INSERT INTO students (roll_no, name, section, email, batch_id) VALUES (?, ?, ?, ?, ?)');
  for (const s of students) {
    const bid = batchMap[s[4]] || null
    sStmt.run([s[0], s[1], s[2], s[3], bid]);
  }
  sStmt.free();

  const qStmt = db.prepare('INSERT INTO quizzes (title, date, total_marks) VALUES (?, ?, ?)');
  for (const q of quizzes) qStmt.run(q);
  qStmt.free();

  const aStmt = db.prepare('INSERT INTO assignments (title, date, total_marks) VALUES (?, ?, ?)');
  for (const a of assignments) aStmt.run(a);
  aStmt.free();

  const pStmt = db.prepare('INSERT INTO semester_projects (title, date, total_marks) VALUES (?, ?, ?)');
  for (const p of projects) pStmt.run(p);
  pStmt.free();
  db.exec('COMMIT;');
}

function stmtAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function stmtGet(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) row = stmt.getAsObject();
  stmt.free();
  return row;
}

function getStudents(batchId = null) {
  if (batchId) {
    return stmtAll('SELECT s.*, b.batch_name FROM students s LEFT JOIN batches b ON s.batch_id = b.id WHERE s.batch_id = ? ORDER BY s.roll_no', [batchId]);
  }
  return stmtAll('SELECT s.*, b.batch_name FROM students s LEFT JOIN batches b ON s.batch_id = b.id ORDER BY s.roll_no');
}

function insertStudents(list) {
  // list: [{roll_no, name, section, email?, batch_id?}]
  try {
    db.exec('BEGIN TRANSACTION;');
    const stmt = db.prepare('INSERT OR IGNORE INTO students (roll_no, name, section, email, batch_id) VALUES (?, ?, ?, ?, ?)');
    for (const s of list) {
      stmt.run([s.roll_no, s.name, s.section || '', s.email || '', s.batch_id || null]);
    }
    stmt.free();
    db.exec('COMMIT;');
    persist();
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (e) { /* ignore */ }
    throw err;
  }

  return getStudents();
}

function getAssessments() {
  const quizzes = stmtAll('SELECT * FROM quizzes');
  const assignments = stmtAll('SELECT * FROM assignments');
  const projects = stmtAll('SELECT * FROM semester_projects');
  return { quizzes, assignments, projects };
}

function addAssessment(type, { title, date, total_marks }) {
  const tableMap = {
    quiz: 'quizzes',
    assignment: 'assignments',
    project: 'semester_projects'
  };
  const table = tableMap[type];
  if (!table) throw new Error('Invalid assessment type');

  db.exec('BEGIN TRANSACTION;');
  try {
    const stmt = db.prepare(`INSERT INTO ${table} (title, date, total_marks) VALUES (?, ?, ?)`);
    stmt.run([title, date, total_marks]);
    stmt.free();
    db.exec('COMMIT;');
    persist();
    const row = stmtGet('SELECT last_insert_rowid() AS id');
    return { id: row ? row.id : null };
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (e) { /* ignore */ }
    throw err;
  }
}

function updateAssessment(type, { id, title, date, total_marks }) {
  const tableMap = {
    quiz: 'quizzes',
    assignment: 'assignments',
    project: 'semester_projects'
  };
  const table = tableMap[type];
  if (!table) throw new Error('Invalid assessment type');

  db.exec('BEGIN TRANSACTION;');
  try {
    const stmt = db.prepare(`UPDATE ${table} SET title = ?, date = ?, total_marks = ? WHERE id = ?`);
    stmt.run([title, date, total_marks, id]);
    stmt.free();
    db.exec('COMMIT;');
    persist();
    return { success: true };
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (e) { /* ignore */ }
    throw err;
  }
}

function deleteAssessment(type, id) {
  const tableMap = {
    quiz: 'quizzes',
    assignment: 'assignments',
    project: 'semester_projects'
  };
  const table = tableMap[type];
  if (!table) throw new Error('Invalid assessment type');

  db.exec('BEGIN TRANSACTION;');
  try {
    const delMarks = db.prepare('DELETE FROM marks WHERE assessment_type = ? AND assessment_id = ?');
    delMarks.run([type, id]);
    delMarks.free();

    const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
    stmt.run([id]);
    stmt.free();
    db.exec('COMMIT;');
    persist();
    return { success: true };
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (e) { /* ignore */ }
    throw err;
  }
}

function addStudent({ roll_no, name, section, email, batch_id }) {
  db.exec('BEGIN TRANSACTION;');
  try {
    const stmt = db.prepare('INSERT INTO students (roll_no, name, section, email, batch_id) VALUES (?, ?, ?, ?, ?)');
    stmt.run([roll_no, name, section || '', email || '', batch_id || null]);
    stmt.free();
    db.exec('COMMIT;');
    persist();
    return { success: true };
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (e) { /* ignore */ }
    throw err;
  }
}

function updateStudent({ id, roll_no, name, section, email, batch_id }) {
  db.exec('BEGIN TRANSACTION;');
  try {
    const stmt = db.prepare('UPDATE students SET roll_no = ?, name = ?, section = ?, email = ?, batch_id = ? WHERE id = ?');
    stmt.run([roll_no, name, section || '', email || '', batch_id || null, id]);
    stmt.free();
    db.exec('COMMIT;');
    persist();
    return { success: true };
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (e) { /* ignore */ }
    throw err;
  }
}

function deleteStudent(id) {
  db.exec('BEGIN TRANSACTION;');
  try {
    const stmt = db.prepare('DELETE FROM students WHERE id = ?');
    stmt.run([id]);
    stmt.free();
    db.exec('COMMIT;');
    persist();
    return { success: true };
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (e) { /* ignore */ }
    throw err;
  }
}

function getMarksForAssessment(type, id, batchId = null) {
  const params = [type, id];
  let sql = `SELECT s.id as student_id, s.roll_no, s.name, s.section, s.batch_id, b.batch_name, m.obtained_marks
     FROM students s
     LEFT JOIN marks m ON m.student_id = s.id AND m.assessment_type = ? AND m.assessment_id = ?
     LEFT JOIN batches b ON s.batch_id = b.id`;
  if (batchId) { sql += ' WHERE s.batch_id = ?'; params.push(batchId); }
  sql += ' ORDER BY s.roll_no';
  const rows = stmtAll(sql, params);
  return rows;
}

function saveMarks({ assessment_type, assessment_id, marks, total_marks }) {
  try {
    db.exec('BEGIN TRANSACTION;');

    const insertStmt = db.prepare('INSERT INTO marks (student_id, assessment_type, assessment_id, obtained_marks) VALUES (?, ?, ?, ?)');

    for (const m of marks) {
      if (m.obtained_marks === '' || m.obtained_marks === null || typeof m.obtained_marks === 'undefined') continue;
      if (m.obtained_marks > total_marks) throw new Error(`Obtained marks cannot exceed total marks for student ${m.student_id}`);
      const ex = stmtGet('SELECT id FROM marks WHERE student_id = ? AND assessment_type = ? AND assessment_id = ?', [m.student_id, assessment_type, assessment_id]);
      if (ex) throw new Error(`Marks already exist for student ${m.student_id} for this assessment`);
      insertStmt.run([m.student_id, assessment_type, assessment_id, m.obtained_marks]);
    }

    insertStmt.free();
    db.exec('COMMIT;');
    persist();
    return { success: true };
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (e) { /* ignore */ }
    return { success: false, message: err.message };
  }
}

function fetchEvaluationData(batchId = null) {
  const students = getStudents(batchId);
  const assessments = getAssessments();
  let marksRows = stmtAll('SELECT * FROM marks');
  if (batchId) {
    // filter marks to only include students in this batch
    const studentIds = students.map(s => s.id);
    marksRows = marksRows.filter(m => studentIds.includes(m.student_id));
  }
  return { students, assessments, marksRows };
}

function getBatches() {
  return stmtAll('SELECT * FROM batches ORDER BY batch_name');
}

function createBatch(batch_name) {
  try {
    db.exec('BEGIN TRANSACTION;');
    const stmt = db.prepare('INSERT INTO batches (batch_name, created_at) VALUES (?, ?)');
    stmt.run([batch_name, new Date().toISOString()]);
    stmt.free();
    db.exec('COMMIT;');
    persist();
    return { success: true };
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (e) { /* ignore */ }
    return { success: false, message: err.message };
  }
}

function bulkUpdateSection(studentIds, section) {
  try {
    console.log('bulkUpdateSection called with studentIds:', studentIds, 'section:', section);
    db.exec('BEGIN TRANSACTION;');
    const stmt = db.prepare('UPDATE students SET section = ? WHERE id = ?');
    for (const id of studentIds) {
      console.log('Updating student ID:', id, 'to section:', section);
      stmt.run([section, id]);
    }
    stmt.free();
    db.exec('COMMIT;');
    persist();
    console.log('Bulk update completed successfully');
    return { success: true };
  } catch (err) {
    console.error('Bulk update error in database:', err);
    try { db.exec('ROLLBACK;'); } catch (e) { /* ignore */ }
    return { success: false, message: err.message };
  }
}

function clearAllData() {
  try {
    console.log('clearAllData: Starting to clear all data...');
    db.exec('BEGIN TRANSACTION;');
    
    console.log('clearAllData: Deleting marks...');
    const delMarks = db.prepare('DELETE FROM marks');
    delMarks.step();
    delMarks.free();
    
    console.log('clearAllData: Deleting students...');
    const delStudents = db.prepare('DELETE FROM students');
    delStudents.step();
    delStudents.free();
    
    console.log('clearAllData: Deleting quizzes...');
    const delQuizzes = db.prepare('DELETE FROM quizzes');
    delQuizzes.step();
    delQuizzes.free();
    
    console.log('clearAllData: Deleting assignments...');
    const delAssignments = db.prepare('DELETE FROM assignments');
    delAssignments.step();
    delAssignments.free();
    
    console.log('clearAllData: Deleting semester_projects...');
    const delProjects = db.prepare('DELETE FROM semester_projects');
    delProjects.step();
    delProjects.free();
    
    db.exec('COMMIT;');
    persist();
    console.log('clearAllData: All data cleared successfully');
    return { success: true };
  } catch (err) {
    console.error('clearAllData: Error occurred:', err);
    try { db.exec('ROLLBACK;'); } catch (e) { console.error('clearAllData: Rollback error:', e); }
    return { success: false, message: err.message };
  }
}

module.exports = {
  init,
  getStudents,
  insertStudents,
  getAssessments,
  addAssessment,
  updateAssessment,
  deleteAssessment,
  addStudent,
  updateStudent,
  deleteStudent,
  getMarksForAssessment,
  saveMarks,
  fetchEvaluationData,
  getBatches,
  createBatch,
  bulkUpdateSection,
  clearAllData
};
