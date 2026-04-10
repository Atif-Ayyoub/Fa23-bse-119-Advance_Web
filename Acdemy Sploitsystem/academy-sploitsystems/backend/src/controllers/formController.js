const leadService = require('../services/leadService')

function getRequestMeta(req) {
  return {
    ip_address: req.ip,
    user_agent: req.get('user-agent') || null,
  }
}

const submitContact = async (req, res, next) => {
  try {
    const created = await leadService.createContactLead({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message,
      ...getRequestMeta(req),
    })
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: created,
    })
  } catch (error) {
    next(error)
  }
}

const submitEnrollment = async (req, res, next) => {
  try {
    const created = await leadService.createEnrollmentLead({
      course: req.body.preferredCourse,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      country: req.body.country,
      city: req.body.city,
      educationLevel: req.body.educationLevel,
      message: req.body.message,
      ...getRequestMeta(req),
    })
    res.status(201).json({
      success: true,
      message: 'Enrollment submitted successfully',
      data: created,
    })
  } catch (error) {
    next(error)
  }
}

const submitWorkshop = async (req, res, next) => {
  try {
    const created = await leadService.createWorkshopLead({
      workshop: req.body.interest,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      country: req.body.country,
      city: req.body.city,
      ...getRequestMeta(req),
    })
    res.status(201).json({
      success: true,
      message: 'Workshop registration submitted successfully',
      data: created,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  submitContact,
  submitEnrollment,
  submitWorkshop,
}
