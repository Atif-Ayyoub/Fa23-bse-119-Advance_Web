const express = require('express')
const leadService = require('../../services/leadService')

const router = express.Router()

// Protect with ADMIN_KEY header if set
router.post('/migrate', async (req, res) => {
  const adminKey = process.env.ADMIN_KEY
  if (adminKey) {
    const supplied = req.get('x-admin-key') || req.query.admin_key
    if (!supplied || supplied !== adminKey) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
  }

  try {
    const result = await leadService.migrateInMemoryToDb()
    res.json({ success: true, migrated: result })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message || 'Error' })
  }
})

module.exports = router
