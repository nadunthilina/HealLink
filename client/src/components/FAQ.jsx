import { useState } from 'react'

const Item = ({ question, children, defaultOpen=false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`rounded-xl bg-white p-5 shadow-soft ${open ? 'ring-1 ring-emerald-400' : ''}`}>
      <button type="button" onClick={()=>setOpen(!open)} className="w-full flex items-center justify-between text-left">
        <div className="flex items-center gap-3">
          <span className={`inline-block h-1.5 w-6 rounded-full ${open ? 'bg-emerald-400' : 'bg-slate-300'}`} />
          <span className="font-medium text-slate-900">{question}</span>
        </div>
        <span className="text-slate-400 text-xl">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="mt-3 text-slate-600 text-sm">{children}</p>}
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="section bg-blue-50/40">
      <div className="container">
        <h2 className="text-center text-2xl font-semibold text-blue-700">Frequently Ask Questions</h2>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <Item question="How do I book a caretaker?" defaultOpen>
            Patients/families can search for available caretakers through the directory and request service directly.
          </Item>
          <Item question="Can caretakers manage their availability?">
            Yes. Caretakers can set and update their availability, which is used for matching and scheduling.
          </Item>
          <Item question="Does the system send reminders?">
            The system can send in‑app, email, or SMS notifications for assignments and upcoming shifts.
          </Item>
        </div>
      </div>
    </section>
  )
}
