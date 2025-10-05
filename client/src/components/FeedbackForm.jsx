import { useState } from 'react'

const Star = ({ filled, onClick }) => (
  <button type="button" onClick={onClick} aria-label="rate" className="text-2xl">
    <span className={filled ? 'text-yellow-400' : 'text-slate-300'}>★</span>
  </button>
)

export default function FeedbackForm() {
  const [rating, setRating] = useState(3)
  const [userType, setUserType] = useState('Patient /Family')

  return (
    <section id="feedback" className="section bg-blue-50/40">
      <div className="container">
        <h2 className="text-center text-2xl font-semibold text-blue-700">Feedback</h2>

        <form className="mt-8 bg-white rounded-3xl p-8 shadow-soft grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm">Name</span>
              <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Carter" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Email</span>
              <input type="email" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email address" />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm">Phone Number</span>
              <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="(123) 456-7890" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">User Type</span>
              <select value={userType} onChange={(e)=>setUserType(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
                <option>Patient /Family</option>
                <option>Caretaker</option>
                <option>Office Staff</option>
              </select>
            </label>
          </div>

          <div className="grid md:grid-cols-[auto_1fr] items-center gap-3">
            <span className="text-sm">Your service rating</span>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map((i)=> (
                <Star key={i} filled={i<=rating} onClick={()=>setRating(i)} />
              ))}
            </div>
          </div>

          <details className="rounded-xl border border-slate-200">
            <summary className="cursor-pointer px-4 py-3">Additional feedback</summary>
            <div className="p-4">
              <textarea rows={4} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="If you have any additional feedback, please type it in here..."></textarea>
            </div>
          </details>

          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" />
            <span className="text-sm text-slate-600">I have read and accept the Privacy Policy.</span>
          </label>

          <div>
            <button type="submit" className="btn-primary">Submit feedback</button>
          </div>
        </form>
      </div>
    </section>
  )
}
