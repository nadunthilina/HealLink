export default function Hero() {
  return (
    <section id="home" className="section">
      <div className="container grid md:grid-cols-2 items-center gap-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Revolutionizing Caretaker
            <br />
            and Patient Management
          </h1>
          <p className="mt-4 text-slate-600 max-w-prose">
            A mobile-responsive web-based solution designed to transform caretaker coordination in Sri Lanka. 
            Manage caretaker records, assign schedules efficiently, and enable patients and families to connect with available caretakers in real time.
          </p>
          <div className="mt-6">
            <a href="#registration" className="btn-primary">Get Started</a>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            <div className="chip">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
              </span>
              <div>
                <p className="font-medium">24 hour service</p>
                <p className="text-xs text-blue-100/80">Always available for uninterrupted patient care.</p>
              </div>
            </div>
            <div className="chip">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M6.75 3a.75.75 0 00-.75.75V6H4.5A2.25 2.25 0 002.25 8.25v9A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0019.5 6h-1.5V3.75a.75.75 0 00-.75-.75h-10.5z" />
                </svg>
              </span>
              <div>
                <p className="font-medium">Smart Scheduling</p>
                <p className="text-xs text-blue-100/80">Automated assignments with conflict detection.</p>
              </div>
            </div>
            <div className="chip">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M1.5 8.25a2.25 2.25 0 012.25-2.25h16.5a2.25 2.25 0 012.25 2.25v7.5A2.25 2.25 0 0120.25 18H9.75L4.5 21v-3H3.75A2.25 2.25 0 011.5 15.75v-7.5z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <p className="font-medium">Better Communication</p>
                <p className="text-xs text-blue-100/80">Instant alerts for admins, caretakers, families.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-blue-50 blur-2xl" aria-hidden></div>
          <div className="relative aspect-square rounded-[32px] bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-soft overflow-hidden p-4">
           
            <picture>
              <source
                type="image"
                srcSet="/images/Hero.webp 1x, /images/Hero@2x.webp 2x"
                sizes="(min-width: 868px) 60vw, 90vw"
              />
              <img
                src="/images/Hero.webp"
                alt="Nurse assisting patient"
                className="max-w-[100%] max-h-[90%] w-auto h-auto object-contain"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  )
}
