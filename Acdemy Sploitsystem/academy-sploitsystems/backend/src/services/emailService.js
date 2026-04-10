const nodemailer = require('nodemailer')

let transporter

const FORM_RECIPIENTS = {
  contact: process.env.CONTACT_FORM_TO || 'contact@sploitsystems.com',
  enrollment: process.env.ENROLLMENT_FORM_TO || 'academy@sploitsystems.com',
  workshop: process.env.WORKSHOP_FORM_TO || 'workshop@sploitsystems.com',
}

function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM)
}

function getTransporter() {
  if (transporter) {
    return transporter
  }

  if (!isEmailConfigured()) {
    return null
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  return transporter
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function toPrintableRows(fields) {
  return Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([label, value]) => `<tr><td style="padding:8px 12px;border:1px solid #d8dee9;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #d8dee9;">${escapeHtml(value).replace(/\n/g, '<br />')}</td></tr>`)
    .join('')
}

function toPlainText(fields) {
  return Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')
}

async function sendLeadNotification(formType, lead) {
  if (!isEmailConfigured()) {
    return { delivered: false, skipped: true, reason: 'smtp-not-configured' }
  }

  const recipient = FORM_RECIPIENTS[formType]
  const subjectPrefix = {
    contact: 'New Contact Inquiry',
    enrollment: 'New Enrollment Request',
    workshop: 'New Workshop Request',
  }[formType]

  const fields = {
    Name: lead.name,
    Email: lead.email,
    Phone: lead.phone,
    Subject: lead.subject,
    Course: lead.course,
    Workshop: lead.workshop,
    Country: lead.country,
    City: lead.city,
    'Education Level': lead.educationLevel,
    Message: lead.message,
    'IP Address': lead.ip_address,
    'User Agent': lead.user_agent,
    'Submitted At': lead.createdAt,
  }

  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM,
      to: recipient,
      bcc: process.env.FORM_FORWARD_TO || 'qaisraniharis05@gmail.com',
      replyTo: lead.email || undefined,
      subject: `${subjectPrefix} | ${lead.name || 'Website Lead'}`,
      text: toPlainText(fields),
      html: `
        <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6;">
          <h2 style="margin-bottom:16px;">${escapeHtml(subjectPrefix)}</h2>
          <table style="border-collapse:collapse;width:100%;max-width:760px;">${toPrintableRows(fields)}</table>
        </div>
      `,
    })
    return { delivered: true, skipped: false }
  } catch (cause) {
    return {
      delivered: false,
      skipped: false,
      reason: 'send-failed',
      error: cause,
    }
  }
}

module.exports = {
  isEmailConfigured,
  sendLeadNotification,
}