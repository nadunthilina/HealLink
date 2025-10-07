export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
      <div className="container section">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold">System Info</h3>
            <ul className="mt-3 space-y-2 text-blue-100">
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#services" className="hover:underline">Services</a></li>
              <li><a href="#feedback" className="hover:underline">Feedback</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Book Now</h3>
            <ul className="mt-3 space-y-2 text-blue-100">
              <li><a href="#appointment" className="hover:underline">Appointment</a></li>
              <li><a href="#badulla" className="hover:underline">Badulla</a></li>
              <li><a href="#ampara" className="hover:underline">Ampara</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Contact</h3>
            <ul className="mt-3 space-y-2 text-blue-100">
              <li><a href="tel:0778925635" className="hover:underline">077 8925635</a></li>
              <li><a href="tel:0764363935" className="hover:underline">076 4363935</a></li>
            </ul>
          </div>
        </div>

        <hr className="border-white/20 my-8" />
        <p className="text-center text-blue-100">© All rights Reserved - 2025</p>
      </div>
    </footer>
  )
}
