import { useEffect, useState } from 'react'
import { Card, SectionHeading, Spinner } from '../../components/ui'
import { fetchMarketplaceLookups } from '../../services/publishingService'

export function FaqPage() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadFaq() {
      try {
        const lookups = await fetchMarketplaceLookups()
        if (active) setQuestions(lookups.questions)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadFaq()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Spinner className="h-6 w-6 text-brand-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <SectionHeading title="Frequently Asked Questions" subtitle="Policy, payments, and publishing guidance." />
      <div className="space-y-3">
        {questions.map((q) => (
          <Card key={q.id} className="space-y-2">
            <details>
              <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">{q.question}</summary>
              <p className="mt-2 text-sm leading-6 text-slate-600">{q.answer}</p>
            </details>
          </Card>
        ))}
      </div>
    </div>
  )
}
