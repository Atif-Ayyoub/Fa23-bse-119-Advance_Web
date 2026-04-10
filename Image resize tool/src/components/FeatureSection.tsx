export function FeatureSection() {
  const features = [
    {
      title: 'Fast Workflow',
      description:
        'Upload, resize, and download in one clear flow without hidden complexity.',
    },
    {
      title: 'Premium Controls',
      description:
        'Adjust dimensions, output format, and quality with precise, friendly controls.',
    },
    {
      title: 'Responsive Experience',
      description:
        'Built for desktop, tablet, and mobile with clear layout hierarchy and touch-friendly actions.',
    },
  ]

  return (
    <section id="features" className="section-gap pt-0">
      <div className="app-container grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-[20px] border border-[#ddd9ef] bg-white/90 p-6 shadow-[0_14px_30px_-22px_rgba(35,27,74,0.45)] dark:border-[#2d3550] dark:bg-[#141b2d]/90"
          >
            <h3 className="font-display text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#696383] dark:text-[#a4add2]">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
