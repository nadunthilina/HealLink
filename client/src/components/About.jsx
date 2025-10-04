export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <h2 className="text-center text-2xl font-semibold text-blue-700">About Us</h2>

        <div className="mt-8 grid md:grid-cols-2 gap-10 items-start">
          <div className="text-slate-700 leading-relaxed">
            <p>
              HealLink is an innovative caretaker management system developed to support
              Harshi Nursing Service in collaboration with Badulla Hospital. Our goal is to replace outdated manual caretaker 
              record-keeping and scheduling with a modern, digital solution.
            </p>
            <p className="mt-4">
              Developed by a team of students from the Faculty of Computing, Sabaragamuwa University of Sri Lanka, 
              HealLink addresses key challenges faced by caretaker providers and patients. By streamlining operations with 
              real-time scheduling, profile management, and communication features, the system ensures better patient care,
              reduces errors, and improves efficiency.
            </p>

            <div className="mt-4">
              <p className="font-medium">Branches:</p>
              <ul className="list-disc ml-6">
                <li>Badulla</li>
                <li>Ampara</li>
              </ul>
            </div>

            <div className="mt-4">
              <p className="font-medium">Phone Numbers:</p>
              <ul className="list-disc ml-6">
                <li>077 8925635</li>
                <li>076 4553935</li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-blue-50 blur-2xl" aria-hidden></div>
            <div className="relative aspect-square rounded-[32px] bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-soft overflow-hidden p-4 md:p-6">
              {/* Illustration: place your image at client/public/images/about.png */}
              <img src="/images/about.png" alt="Caretaker with patient" className="w-auto h-auto object-contain max-w-[85%] max-h-[320px] md:max-h-[400px] lg:max-h-[460px]" onError={(e)=>{e.currentTarget.style.display='none'}} />
              <span className="text-blue-400 text-8xl" aria-hidden></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
