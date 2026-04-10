#!/usr/bin/env node
require('dotenv').config()
const mysql = require('mysql2/promise')

function uniqueConfigs(configs) {
  const seen = new Set()
  return configs.filter((cfg) => {
    const key = `${cfg.host}|${cfg.user}|${cfg.password}|${cfg.port}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function tryConnect(cfg) {
  const conn = await mysql.createConnection({
    host: cfg.host,
    user: cfg.user,
    password: cfg.password,
    port: cfg.port,
  })
  return conn
}

async function ensureSchema(conn, dbName) {
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
  await conn.query(`USE \`${dbName}\``)

  await conn.query(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)

  await conn.query(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)

  await conn.query(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)

  const [rows] = await conn.query(`SHOW TABLES FROM \`${dbName}\``)
  return rows
}

async function main() {
  const dbName = process.env.DB_NAME || 'academy_db'
  const dbUser = process.env.DB_USER || 'root'
  const dbPass = typeof process.env.DB_PASS === 'string' ? process.env.DB_PASS : ''
  const dbHost = process.env.DB_HOST || '127.0.0.1'
  const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306

  const candidates = uniqueConfigs([
    { host: dbHost, user: dbUser, password: dbPass, port: dbPort },
    { host: dbHost, user: dbUser, password: '', port: dbPort },
    { host: dbHost === '127.0.0.1' ? 'localhost' : '127.0.0.1', user: dbUser, password: dbPass, port: dbPort },
    { host: dbHost === '127.0.0.1' ? 'localhost' : '127.0.0.1', user: dbUser, password: '', port: dbPort },
  ])

  let conn = null
  let used = null

  for (const cfg of candidates) {
    try {
      conn = await tryConnect(cfg)
      used = cfg
      break
    } catch {
      // try next
    }
  }

  if (!conn) {
    console.error('Could not connect to MySQL with provided/fallback local credentials.')
    console.error('Checked host/user combinations based on DB_HOST, DB_USER, DB_PASS.')
    process.exit(2)
  }

  try {
    const tables = await ensureSchema(conn, dbName)
    console.log('Schema synced successfully.')
    console.log('Connected with:', { host: used.host, user: used.user, port: used.port, password: used.password ? '***' : '(empty)' })
    console.log('Tables now in database:', tables.length)
    console.log(tables)
    process.exit(0)
  } catch (error) {
    console.error('Schema sync failed:', error.message || error)
    process.exit(3)
  } finally {
    try {
      await conn.end()
    } catch {
      // ignore
    }
  }
}

main()
