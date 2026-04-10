require('dotenv').config()
const mysql = require('mysql2/promise')

const DB_READY = !!process.env.DB_HOST && !!process.env.DB_USER && !!process.env.DB_NAME

let pool = null

async function ensureColumn(tableName, definition) {
  try {
    await pool.execute(`ALTER TABLE ${tableName} ADD COLUMN ${definition}`)
  } catch (error) {
    if (!String(error.message || '').includes('Duplicate column name')) {
      console.error(`DB column sync error on ${tableName}:`, error.message || error)
    }
  }
}

async function initPool() {
  if (!DB_READY) return null
  if (pool) return pool

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONN_LIMIT || 10),
  })

  // Ensure simple tables exist
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200),
        email VARCHAR(255),
        phone VARCHAR(50),
        subject VARCHAR(255),
        company VARCHAR(200),
        region VARCHAR(120),
        message TEXT,
        ip_address VARCHAR(45),
        user_agent VARCHAR(300),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS enrollment_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200),
        email VARCHAR(255),
        phone VARCHAR(50),
        country VARCHAR(120),
        city VARCHAR(120),
        education_level VARCHAR(200),
        course VARCHAR(200),
        message TEXT,
        ip_address VARCHAR(45),
        user_agent VARCHAR(300),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS workshop_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200),
        email VARCHAR(255),
        phone VARCHAR(50),
        country VARCHAR(120),
        city VARCHAR(120),
        workshop VARCHAR(200),
        message TEXT,
        ip_address VARCHAR(45),
        user_agent VARCHAR(300),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

    await ensureColumn('contact_messages', 'phone VARCHAR(50)')
    await ensureColumn('contact_messages', 'subject VARCHAR(255)')
    await ensureColumn('enrollment_leads', 'phone VARCHAR(50)')
    await ensureColumn('enrollment_leads', 'country VARCHAR(120)')
    await ensureColumn('enrollment_leads', 'city VARCHAR(120)')
    await ensureColumn('enrollment_leads', 'education_level VARCHAR(200)')
    await ensureColumn('workshop_leads', 'phone VARCHAR(50)')
    await ensureColumn('workshop_leads', 'country VARCHAR(120)')
    await ensureColumn('workshop_leads', 'city VARCHAR(120)')
  } catch (e) {
    console.error('DB init error:', e.message || e)
  }

  return pool
}

async function query(sql, params) {
  const p = await initPool()
  if (!p) throw new Error('DB not configured')
  const [rows] = await p.execute(sql, params)
  return rows
}

module.exports = { initPool, query, getPool: () => pool }
