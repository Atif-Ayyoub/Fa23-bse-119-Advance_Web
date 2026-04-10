import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import { CONTACT_EMAIL, PRIMARY_PHONE, WHATSAPP_URL } from '../lib/contact'
import { submitContactForm } from '../lib/api'
import { getRecaptchaToken } from '../lib/recaptcha'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

function ContactPage() {
  document.title = 'Contact | academy.sploitsystems.com'

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
      const recaptchaToken = await getRecaptchaToken('contact_form')
      await submitContactForm({ ...formData, recaptchaToken })
      setFeedback('Message sent successfully. We will reply soon.')
      setFormData(initialForm)
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to send your message at this time.'
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
            eyebrow="Contact"
            title="Let’s Talk About Your IT Career"
            description="Reach out for admissions support, course guidance, and workshop slots."
          />

          <div className="glass-card mt-8 rounded-2xl p-7">
            <p className="mb-2 text-sm text-[#a8b0c3]">Email</p>
            <p className="mb-4 text-base text-white">{CONTACT_EMAIL}</p>
            <p className="mb-2 text-sm text-[#a8b0c3]">WhatsApp</p>
            <p className="mb-6 text-base text-white">{PRIMARY_PHONE}</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary w-full sm:w-auto">
              <FaWhatsapp className="mr-2" /> Chat on WhatsApp: {PRIMARY_PHONE}
            </a>
            <div className="mt-6 rounded-xl border border-dashed border-[#1f2a44] p-4 text-sm text-[#a8b0c3]">
              Based in Pakistan, Dubai, Cyprus and Lebanon.
            </div>
            <Link to="/faq" className="mt-4 inline-block text-sm text-[#ff7a3c] hover:underline">
              View FAQ Preview
            </Link>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass-card rounded-2xl p-8">
          <div className="space-y-4">
            <input name="name" value={formData.name} onChange={onChange} className="input-base" placeholder="Your Name" required />
            <input type="email" name="email" value={formData.email} onChange={onChange} className="input-base" placeholder="Email Address" required />
            <input name="phone" value={formData.phone} onChange={onChange} className="input-base" placeholder="Phone / WhatsApp" required />
            <input name="subject" value={formData.subject} onChange={onChange} className="input-base" placeholder="Subject" required />
            <textarea name="message" value={formData.message} onChange={onChange} className="textarea-base" rows="5" placeholder="Type your message" required />
          </div>
          <button disabled={loading} className="btn-primary mt-6 h-[50px] w-full" type="submit">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          <p className="mt-3 text-xs text-[#7f889c]">Protected by Google reCAPTCHA v3.</p>
          {feedback ? <p className="mt-4 text-sm text-[#d2d8e4]">{feedback}</p> : null}
        </form>
      </div>
    </section>
  )
}

export default ContactPage
