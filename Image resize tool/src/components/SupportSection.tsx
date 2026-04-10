export function SupportSection() {
  const faqs = [
    'Accepted formats: JPG, PNG, WEBP',
    'Maximum file size: 20MB per image',
    'Resize flow is secure and designed for reliable output',
  ]

  return (
    <section id="support" className="section-gap pt-0">
      <div className="app-container">
        <div className="panel">
          <h2 className="font-display text-[28px] font-bold leading-tight md:text-[32px]">
            Support & Help
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#676180] dark:text-[#a4add2]">
            Need a quick answer? PixelResize Pro is built for straightforward workflows. If something fails,
            retry with a smaller file or different format.
          </p>
          <ul className="mt-6 grid gap-3 text-sm md:grid-cols-3">
            {faqs.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-[#ddd9ef] bg-white/80 px-4 py-3 dark:border-[#2f3752] dark:bg-[#11192d]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
