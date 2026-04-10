const db = require('../db')
const { sendLeadNotification } = require('./emailService')

const contactLeads = []
const enrollmentLeads = []
const workshopLeads = []

const withMeta = (payload) => ({
  ...payload,
  id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  createdAt: new Date().toISOString(),
})

async function createContactLead(payload) {
  const item = withMeta(payload)

  try {
    await db.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.name || null, item.email || null, item.phone || null, item.subject || null, item.message || null, item.ip_address || null, item.user_agent || null, item.createdAt],
    )
    item.stored = 'db'
  } catch (e) {
    contactLeads.push(item)
    item.stored = 'memory'
  }

  item.emailDelivery = await sendLeadNotification('contact', item)
  return item
}

async function createEnrollmentLead(payload) {
  const item = withMeta(payload)

  try {
    await db.query(
      `INSERT INTO enrollment_leads (name, email, phone, country, city, education_level, course, message, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.name || null, item.email || null, item.phone || null, item.country || null, item.city || null, item.educationLevel || null, item.course || null, item.message || null, item.ip_address || null, item.user_agent || null, item.createdAt],
    )
    item.stored = 'db'
  } catch (e) {
    enrollmentLeads.push(item)
    item.stored = 'memory'
  }

  item.emailDelivery = await sendLeadNotification('enrollment', item)
  return item
}

async function createWorkshopLead(payload) {
  const item = withMeta(payload)

  try {
    await db.query(
      `INSERT INTO workshop_leads (name, email, phone, country, city, workshop, message, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.name || null, item.email || null, item.phone || null, item.country || null, item.city || null, item.workshop || null, item.message || null, item.ip_address || null, item.user_agent || null, item.createdAt],
    )
    item.stored = 'db'
  } catch (e) {
    workshopLeads.push(item)
    item.stored = 'memory'
  }

  item.emailDelivery = await sendLeadNotification('workshop', item)
  return item
}

module.exports = {
  createContactLead,
  createEnrollmentLead,
  createWorkshopLead,
  // migrate in-memory leads to DB (attempt)
  migrateInMemoryToDb: async function migrateInMemoryToDb() {
    const results = { contact: 0, enrollment: 0, workshop: 0 }
    // move contactLeads
    for (const item of contactLeads.splice(0, contactLeads.length)) {
      try {
        await db.query(
          `INSERT INTO contact_messages (name, email, phone, subject, message, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [item.name || null, item.email || null, item.phone || null, item.subject || null, item.message || null, item.ip_address || null, item.user_agent || null, item.createdAt || new Date().toISOString()],
        )
        results.contact += 1
      } catch (e) {
        // push back if insert fails
        contactLeads.push(item)
      }
    }

    for (const item of enrollmentLeads.splice(0, enrollmentLeads.length)) {
      try {
        await db.query(
          `INSERT INTO enrollment_leads (name, email, phone, country, city, education_level, course, message, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [item.name || null, item.email || null, item.phone || null, item.country || null, item.city || null, item.educationLevel || null, item.course || null, item.message || null, item.ip_address || null, item.user_agent || null, item.createdAt || new Date().toISOString()],
        )
        results.enrollment += 1
      } catch (e) {
        enrollmentLeads.push(item)
      }
    }

    for (const item of workshopLeads.splice(0, workshopLeads.length)) {
      try {
        await db.query(
          `INSERT INTO workshop_leads (name, email, phone, country, city, workshop, message, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [item.name || null, item.email || null, item.phone || null, item.country || null, item.city || null, item.workshop || null, item.message || null, item.ip_address || null, item.user_agent || null, item.createdAt || new Date().toISOString()],
        )
        results.workshop += 1
      } catch (e) {
        workshopLeads.push(item)
      }
    }

    return results
  }
}
