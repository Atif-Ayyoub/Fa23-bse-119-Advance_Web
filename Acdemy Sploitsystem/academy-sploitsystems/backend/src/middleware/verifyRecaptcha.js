const { verifyRecaptchaToken } = require('../services/recaptchaService')

function verifyRecaptcha(expectedAction) {
  return async function verifyRecaptchaMiddleware(req, res, next) {
    try {
      await verifyRecaptchaToken(req.body.recaptchaToken, expectedAction)
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = verifyRecaptcha