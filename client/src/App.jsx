import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import FeedbackForm from './components/FeedbackForm'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <FeedbackForm />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
