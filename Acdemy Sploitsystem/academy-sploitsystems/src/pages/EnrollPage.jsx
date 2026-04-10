import { useState } from 'react'
import SectionHeader from '../components/common/SectionHeader'
import { courses } from '../data/courseData'
import { submitEnrollmentForm } from '../lib/api'
import { getRecaptchaToken } from '../lib/recaptcha'

const initialForm = {
  preferredCourse: '',
  name: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  educationLevel: '',
  message: '',
}

function EnrollPage() {
  document.title = 'Enroll Now | academy.sploitsystems.com'

  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setFeedback('')

    try {
      const recaptchaToken = await getRecaptchaToken('enroll_form')
      await submitEnrollmentForm({ ...formData, recaptchaToken })
      setFeedback('Enrollment request submitted successfully. Our team will contact you soon.')
      setFormData(initialForm)
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Unable to submit your enrollment request right now.'
      setFeedback(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-spacing">
      <div className="container-primary">
        <SectionHeader
          eyebrow="Admissions"
          title="Enroll Now"
          description="Submit your details and our admissions team will guide your next steps."
        />

        <form onSubmit={onSubmit} className="glass-card mt-10 rounded-2xl p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <select name="preferredCourse" value={formData.preferredCourse} onChange={onChange} className="input-base" required>
              <option value="">Preferred Course</option>
              {courses.map((course) => (
                <option key={course.slug} value={course.name}>{course.name}</option>
              ))}
            </select>
            <input name="name" value={formData.name} onChange={onChange} className="input-base" placeholder="Full Name" required />
            <input type="email" name="email" value={formData.email} onChange={onChange} className="input-base" placeholder="Email" required />
            <input name="phone" value={formData.phone} onChange={onChange} className="input-base" placeholder="Phone / WhatsApp" required />
            <input name="country" value={formData.country} onChange={onChange} className="input-base" placeholder="Country" required />
            <input name="city" value={formData.city} onChange={onChange} className="input-base" placeholder="City" required />
            <input name="educationLevel" value={formData.educationLevel} onChange={onChange} className="input-base md:col-span-2" placeholder="Education Level" required />
            <textarea
              name="message"
              value={formData.message}
              onChange={onChange}
              rows="4"
              className="textarea-base md:col-span-2"
              placeholder="Tell us your goals"
            />
          </div>

          <button disabled={loading} type="submit" className="btn-primary mt-6 h-[50px] w-full md:w-auto">
            {loading ? 'Submitting...' : 'Submit Enrollment'}
          </button>

          <p className="mt-3 text-xs text-[#7f889c]">Protected by Google reCAPTCHA v3.</p>
          {feedback ? <p className="mt-4 text-sm text-[#d2d8e4]">{feedback}</p> : null}
        </form>
      </div>
    </section>
  )
}

export default EnrollPage
