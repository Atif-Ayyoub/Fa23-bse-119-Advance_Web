const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

function isRecaptchaConfigured() {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY)
}

async function verifyRecaptchaToken(token, expectedAction) {
  if (!isRecaptchaConfigured()) {
    const error = new Error('reCAPTCHA is not configured on the server.')
    error.statusCode = 503
    throw error
  }

  if (!token) {
    const error = new Error('reCAPTCHA verification is required.')
    error.statusCode = 400
    throw error
  }

  const response = await fetch(RECAPTCHA_VERIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token,
    }).toString(),
  })

  if (!response.ok) {
    const error = new Error('reCAPTCHA verification service is unavailable.')
    error.statusCode = 502
    throw error
  }

  const result = await response.json()

  if (!result.success) {
    const error = new Error('reCAPTCHA verification failed. Please try again.')
    error.statusCode = 400
    throw error
  }

  if (expectedAction && result.action && result.action !== expectedAction) {
    const error = new Error('Invalid reCAPTCHA action received.')
    error.statusCode = 400
    throw error
  }

  const minimumScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5)
  if (typeof result.score === 'number' && result.score < minimumScore) {
    const error = new Error('reCAPTCHA score was too low. Please try again.')
    error.statusCode = 400
    throw error
  }

  return result
}

module.exports = {
  isRecaptchaConfigured,
  verifyRecaptchaToken,
}