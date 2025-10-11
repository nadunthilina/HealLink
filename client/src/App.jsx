import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import FeedbackForm from "./components/FeedbackForm";
import FAQ from "./components/FAQ";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import Footer from "./components/Footer";
import CaretakerDirectory from "./pages/Patient/CaretakerDirectory";

export default function App() {
  return (
    <Router>
      <div
        style={{
          padding: 24,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/faq" element={<FAQ />} />
            {/* ✅ Patient Dashboard Route */}
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/directory" element={<CaretakerDirectory />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
