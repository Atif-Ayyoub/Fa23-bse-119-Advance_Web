#!/usr/bin/env node
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const db = require('../src/db')
const leadService = require('../src/services/leadService')

async function importFromFile(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('File not found: ' + filePath)
  const content = fs.readFileSync(filePath, 'utf8')
  let data
  try {
    data = JSON.parse(content)
  } catch (e) {
    throw new Error('Failed to parse JSON: ' + e.message)
  }

  if (!Array.isArray(data)) throw new Error('Expected JSON array of lead objects')

  const result = { contact: 0, enrollment: 0, workshop: 0 }

  for (const item of data) {
    const t = (item.type || '').toLowerCase()
    try {
      if (t === 'contact') {
        await db.query(
          `INSERT INTO contact_messages (name, email, phone, subject, message, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
          [item.name || null, item.email || null, item.phone || null, item.subject || null, item.message || null, item.ip_address || null, item.user_agent || null, item.createdAt || new Date().toISOString()]
        )
        result.contact += 1
      } else if (t === 'enrollment') {
        await db.query(
          `INSERT INTO enrollment_leads (name, email, phone, country, city, education_level, course, message, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
          [item.name || null, item.email || null, item.phone || null, item.country || null, item.city || null, item.educationLevel || null, item.course || null, item.message || null, item.ip_address || null, item.user_agent || null, item.createdAt || new Date().toISOString()]
        )
        result.enrollment += 1
      } else if (t === 'workshop') {
        await db.query(
          `INSERT INTO workshop_leads (name, email, phone, country, city, workshop, message, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
          [item.name || null, item.email || null, item.phone || null, item.country || null, item.city || null, item.workshop || null, item.message || null, item.ip_address || null, item.user_agent || null, item.createdAt || new Date().toISOString()]
        )
        result.workshop += 1
      } else {
        console.warn('Unknown type, skipping:', t)
      }
    } catch (e) {
      console.error('Insert failed for item:', e.message || e)
    }
  }

  return result
}

async function main() {
  const argv = process.argv.slice(2)
  const fileArg = argv.find((a) => a.startsWith('--file=') || a.startsWith('-f='))
  const filePath = fileArg ? fileArg.split('=')[1] : argv[0]

  try {
    await db.initPool()
  } catch (e) {
    console.warn('DB pool init warning:', e.message || e)
  }

  if (filePath) {
    const full = path.resolve(process.cwd(), filePath)
    console.log('Importing leads from', full)
    const res = await importFromFile(full)
    console.log('Imported:', res)
    process.exit(0)
  }

  console.log('Migrating in-memory leads (if any) to DB...')
  try {
    const res = await leadService.migrateInMemoryToDb()
    console.log('Migration result:', res)
    process.exit(0)
  } catch (e) {
    console.error('Migration failed:', e.message || e)
    process.exit(2)
  }
}

main()
