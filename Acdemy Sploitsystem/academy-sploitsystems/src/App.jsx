import { Navigate, Route, Routes } from 'react-router-dom'
import PageShell from './components/layout/PageShell'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import CourseDetailPage from './pages/CourseDetailPage'
import CoursesPage from './pages/CoursesPage'
import EnrollPage from './pages/EnrollPage'
import EmployeePage from './pages/EmployeePage'
import FAQPage from './pages/FAQPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import TeamPage from './pages/TeamPage'
import WorkshopPage from './pages/WorkshopPage'

function App() {
  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* Leadership page removed */}
        <Route path="/teams/:slug" element={<TeamPage />} />
        <Route path="/people/:id" element={<EmployeePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/enroll" element={<EnrollPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/workshop" element={<WorkshopPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PageShell>
  )
}

export default App
