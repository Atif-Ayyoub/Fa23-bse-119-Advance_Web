import { m } from 'framer-motion'

export function AuthSplitLayout({ eyebrow, title, description, children, altPanel }) {
  return (
    <div className="auth-shell">
      <div className="auth-grid">
        <section className="auth-main">
          <m.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="auth-main-inner"
          >
            <p className="auth-eyebrow">{eyebrow}</p>
            <h1 className="auth-title">{title}</h1>
            <p className="auth-desc">{description}</p>
            <div className="auth-form-wrap">{children}</div>
          </m.div>
        </section>

        <section className="auth-aside">
          <m.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="auth-aside-content"
          >
            <p className="hero-kicker">AdFlow Pro</p>
            <h2 className="auth-aside-title">
              Secure ad operations with role-aware access and controlled publication.
            </h2>
            <p className="auth-aside-desc">
              Clients submit ads, moderators review quality, and admins verify payments before publishing.
            </p>
            {altPanel}
          </m.div>
        </section>
      </div>
    </div>
  )
}
