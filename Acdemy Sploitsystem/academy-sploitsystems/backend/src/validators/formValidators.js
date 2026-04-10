const { body } = require('express-validator')

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('recaptchaToken').trim().notEmpty().withMessage('reCAPTCHA verification is required'),
]

const enrollmentValidation = [
  body('preferredCourse').trim().notEmpty().withMessage('Preferred course is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('educationLevel').trim().notEmpty().withMessage('Education level is required'),
  body('recaptchaToken').trim().notEmpty().withMessage('reCAPTCHA verification is required'),
]

const workshopValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('interest').trim().notEmpty().withMessage('Course interest is required'),
  body('recaptchaToken').trim().notEmpty().withMessage('reCAPTCHA verification is required'),
]

module.exports = {
  contactValidation,
  enrollmentValidation,
  workshopValidation,
}
