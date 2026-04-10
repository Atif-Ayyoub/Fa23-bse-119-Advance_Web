const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const cors = require('cors')
const express = require('express')
const formRoutes = require('./routes/v1/formRoutes')
const adminRoutes = require('./routes/v1/adminRoutes')
const errorHandler = require('./middleware/errorHandler')
const notFound = require('./middleware/notFound')

const app = express()

const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i
const allowedOrigins = new Set(
  (process.env.FRONTEND_ORIGINS || 'https://academy.sploitsystems.com,https://www.academy.sploitsystems.com')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || localOriginPattern.test(origin) || allowedOrigins.has(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  }),
)

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend is running' })
})

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API healthy' })
})

app.use('/api/v1/forms', formRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use(notFound)
app.use(errorHandler)

module.exports = app
