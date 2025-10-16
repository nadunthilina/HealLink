export default function Footer() {
  return (
    <footer id="contact" className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h4 className="font-semibold mb-2">System Info</h4>
          <ul className="space-y-2 text-blue-100">
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#services" className="hover:underline">Services</a></li>
            <li><a href="#feedback" className="hover:underline">Feedback</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Book Now</h4>
          <ul className="space-y-2 text-blue-100">
            <li>Appointment</li>
            <li>Badulla</li>
            <li>Ampara</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <ul className="space-y-2 text-blue-100">
            <li>077 8925635</li>
            <li>076 4363935</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-blue-100 pb-8">© All rights Reserved - 2025</div>
    </footer>
  )
}
