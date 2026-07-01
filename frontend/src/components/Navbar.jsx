import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-primary text-2xl font-bold">HealLink</Link>
        </div>

        <nav className="hidden md:flex gap-8 items-center text-gray-600">
          <a href="#home" className="hover:text-primary">Home</a>
          <a href="#about" className="hover:text-primary">About</a>
          <a href="#services" className="hover:text-primary">Services</a>
          <a href="#contact" className="hover:text-primary">Contact</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg font-medium transition-colors">
            Login
          </Link>
          <Link to="/signup" className="bg-primary hover:bg-[#0519d9] text-white px-5 py-2 rounded-full shadow-md font-medium transition-colors">
            Sign Up
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(o => !o)} aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-6 py-4 grid gap-4">
            <a href="#home" onClick={() => setOpen(false)} className="text-gray-700 hover:text-primary font-medium">Home</a>
            <a href="#about" onClick={() => setOpen(false)} className="text-gray-700 hover:text-primary font-medium">About</a>
            <a href="#services" onClick={() => setOpen(false)} className="text-gray-700 hover:text-primary font-medium">Services</a>
            <a href="#contact" onClick={() => setOpen(false)} className="text-gray-700 hover:text-primary font-medium">Contact</a>
            <div className="flex gap-3 mt-4 pt-4 border-t">
              <Link to="/login" className="text-gray-700 px-4 py-2 border border-gray-300 rounded-lg font-medium flex-1 text-center" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex-1 text-center" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
