import { useState } from 'react'

export default function FAQItem({ question, children, defaultOpen=false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`rounded-2xl border ${open ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-white'} p-5` }>
      <button className="w-full flex items-center justify-between text-left" onClick={() => setOpen(!open)}>
        <span className="font-medium text-slate-900">{question}</span>
        <span className={`text-2xl ${open? 'text-green-500':'text-slate-400'}`}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="mt-2 text-sm text-slate-600">
          {children}
        </div>
      )}
    </div>
  )
}
