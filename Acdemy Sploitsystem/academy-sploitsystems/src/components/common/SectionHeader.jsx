function SectionHeader({ eyebrow, title, description, center = false }) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#ff7a3c]">{eyebrow}</p>
      ) : null}
      <h2 className="heading-section mb-4 text-white">{title}</h2>
      {description ? <p className="text-base leading-7 text-[#a8b0c3]">{description}</p> : null}
    </div>
  )
}

export default SectionHeader
