const Card = ({ title, children, icon }) => (
  <div className="rounded-3xl bg-white p-6 shadow-soft">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="font-semibold text-slate-900">{title}</h3>
    <p className="text-slate-600 mt-2 text-sm">{children}</p>
  </div>
)

export default function Services() {
  return (
    <section id="services" className="section bg-blue-50/40">
      <div className="container">
        <h2 className="text-center text-2xl font-semibold text-blue-700">Services</h2>

        <div className="mt-12 grid md:grid-cols-2 items-center gap-10">
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-blue-50 blur-2xl" aria-hidden></div>
            <div className="relative aspect-square rounded-[32px] bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-soft overflow-hidden p-4 md:p-6">
              <img src="/images/service.png" alt="Services illustration" className="w-auto h-auto object-contain max-w-[85%] max-h-[320px] md:max-h-[400px] lg:max-h-[460px]" onError={(e)=>{e.currentTarget.style.display='none'}} />
              <span className="text-blue-400 text-8xl" aria-hidden></span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900">Comprehensive Caretaker Management at Your Fingertips</h3>
            <p className="text-slate-600 mt-3">Empowering healthcare with smart caretaker coordination – real-time availability, efficient scheduling, and transparent communication.</p>
            <div className="mt-6">
              <a className="btn-primary" href="#registration">Explore Now</a>
            </div>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <Card title="Caretaker Management" icon="✅">Create and manage caretaker profiles, skills, and certifications.</Card>
          <Card title="Scheduling & Assignment" icon="📅">Assign caretakers using a calendar view with conflict detection.</Card>
          <Card title="Feedback & Rating" icon="⭐">Patients and families can provide service ratings and suggestions.</Card>
        </div>
      </div>
    </section>
  )
}
