import { useState } from 'react'
import SectionHeader from '../components/common/SectionHeader'
import { submitWorkshopForm } from '../lib/api'
import { getRecaptchaToken } from '../lib/recaptcha'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  interest: '',
}

function WorkshopPage() {
  document.title = 'Free Workshop | academy.sploitsystems.com'

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
      const recaptchaToken = await getRecaptchaToken('workshop_form')
      await submitWorkshopForm({ ...formData, recaptchaToken })
      setFeedback('Workshop request submitted. We will share your session details shortly.')
      setFormData(initialForm)
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Unable to register for workshop right now.'
      setFeedback(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-spacing">
      <div className="container-primary grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeader
            eyebrow="Free Session"
            title="Book Free Counseling / Workshop"
            description="Get a personalized career roadmap and program recommendation before you commit."
          />
          <div className="glass-card mt-8 rounded-2xl p-8 text-[#a8b0c3]">
            <p className="mb-3">Included in your free session:</p>
            <ul className="space-y-2 text-sm leading-7">
              <li>• Career goal assessment</li>
              <li>• Course path recommendation</li>
              <li>• Duration and fee breakdown</li>
              <li>• Q&A with admissions advisor</li>
            </ul>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass-card rounded-2xl p-8">
          <div className="space-y-4">
            <input name="name" value={formData.name} onChange={onChange} className="input-base" placeholder="Your Name" required />
            <input type="email" name="email" value={formData.email} onChange={onChange} className="input-base" placeholder="Email" required />
            <input name="phone" value={formData.phone} onChange={onChange} className="input-base" placeholder="Phone / WhatsApp" required />
            <input name="country" value={formData.country} onChange={onChange} className="input-base" placeholder="Country" required />
            <input name="city" value={formData.city} onChange={onChange} className="input-base" placeholder="City" required />
            <input name="interest" value={formData.interest} onChange={onChange} className="input-base" placeholder="Course Interest" required />
          </div>
          <button disabled={loading} type="submit" className="btn-primary mt-6 h-[50px] w-full">
            {loading ? 'Submitting...' : 'Register for Free Session'}
          </button>
          <p className="mt-3 text-xs text-[#7f889c]">Protected by Google reCAPTCHA v3.</p>
          {feedback ? <p className="mt-4 text-sm text-[#d2d8e4]">{feedback}</p> : null}
        </form>
      </div>
    </section>
  )
}

export default WorkshopPage
