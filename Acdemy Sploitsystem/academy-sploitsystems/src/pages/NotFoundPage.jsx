import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="section-spacing">
      <div className="container-primary">
        <div className="glass-card rounded-2xl p-10 text-center">
          <h1 className="heading-section mb-4">Page Not Found</h1>
          <p className="mb-6 text-[#a8b0c3]">The page you requested does not exist.</p>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage
