#!/usr/bin/env node
require('dotenv').config()
const mysql = require('mysql2/promise')

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    port: Number(process.env.DB_PORT || 3306),
  })

  const dbName = process.env.DB_NAME || 'academy_db'
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
  await conn.query(`USE \`${dbName}\``)

  await conn.query('SET FOREIGN_KEY_CHECKS=0')
  await conn.query('DROP TABLE IF EXISTS contact_messages')
  await conn.query('DROP TABLE IF EXISTS enrollment_leads')
  await conn.query('DROP TABLE IF EXISTS workshop_leads')
  await conn.query('SET FOREIGN_KEY_CHECKS=1')

  await conn.query(`
    CREATE TABLE contact_messages (
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
    CREATE TABLE enrollment_leads (
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
    CREATE TABLE workshop_leads (
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

  const [tables] = await conn.query('SHOW TABLES')
  console.log('Recreated tables:', tables)
  await conn.end()
}

main().catch((e) => {
  console.error('recreateTables error:', e.message || e)
  process.exit(1)
})
