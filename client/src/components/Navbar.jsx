export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-slate-100">
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="font-semibold text-blue-700">HealLink</a>
        <nav className="hidden md:flex items-center gap-8 text-slate-700">
          <a href="#home" className="hover:text-blue-700">Home</a>
          <a href="#dashboard" className="hover:text-blue-700">Dashboard</a>
          <a href="#registration" className="hover:text-blue-700">Registration</a>
          <a href="#contact" className="hover:text-blue-700">Contact</a>
        </nav>
        <a href="#login" className="btn-primary">{/* user icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.75 20.1a8.25 8.25 0 0116.5 0 .75.75 0 01-.75.9h-15a.75.75 0 01-.75-.9z" clipRule="evenodd" />
          </svg>
          <span>Log in</span>
        </a>
      </div>
    </header>
  )
}
