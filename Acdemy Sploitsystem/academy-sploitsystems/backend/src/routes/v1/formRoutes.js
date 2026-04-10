const express = require('express')
const {
  submitContact,
  submitEnrollment,
  submitWorkshop,
} = require('../../controllers/formController')
const validateRequest = require('../../middleware/validateRequest')
const {
  contactValidation,
  enrollmentValidation,
  workshopValidation,
} = require('../../validators/formValidators')
const verifyRecaptcha = require('../../middleware/verifyRecaptcha')

const router = express.Router()

router.post('/contact', contactValidation, validateRequest, verifyRecaptcha('contact_form'), submitContact)
router.post('/enroll', enrollmentValidation, validateRequest, verifyRecaptcha('enroll_form'), submitEnrollment)
router.post('/workshop', workshopValidation, validateRequest, verifyRecaptcha('workshop_form'), submitWorkshop)

module.exports = router
