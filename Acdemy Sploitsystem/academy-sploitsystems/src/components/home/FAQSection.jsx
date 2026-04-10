import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { faqs } from '../../data/courseData'
import SectionHeader from '../common/SectionHeader'

function FAQSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="section-spacing">
      <div className="container-primary">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Clear answers for enrollment, class format, language support, and outcomes."
        />
        <div className="mt-8 space-y-4">
          {faqs.map((faq, index) => {
            const isActive = active === index
            return (
              <article key={faq.question} className="glass-card rounded-2xl p-6">
                <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setActive(isActive ? -1 : index)}
                >
                  <span className="text-lg font-medium text-white">{faq.question}</span>
                  <FiChevronDown className={`text-xl text-[#ff7a3c] transition ${isActive ? 'rotate-180' : ''}`} />
                </button>
                {isActive ? <p className="mt-4 text-[15px] leading-7 text-[#a8b0c3]">{faq.answer}</p> : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
