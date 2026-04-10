// CounterSection removed from homepage per request
import DevelopmentTeam from '../components/home/DevelopmentTeam'
import FAQSection from '../components/home/FAQSection'
import FeaturedCourses from '../components/home/FeaturedCourses'
import Hero from '../components/home/Hero'
import LearningProcess from '../components/home/LearningProcess'
import Testimonials from '../components/home/Testimonials'
import WhyChooseUs from '../components/home/WhyChooseUs'
// WorkshopCta removed from homepage per request

function HomePage() {
  document.title = 'Sploitsystems Academy | Practical IT Courses'

  return (
    <>
      <Hero />
      {/* CounterSection removed */}
      <FeaturedCourses />
      <WhyChooseUs />
      <LearningProcess />
      <Testimonials />
      <FAQSection />
      <DevelopmentTeam />
    </>
  )
}

export default HomePage
