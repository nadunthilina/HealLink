import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Caretaker from './Pages/Caretaker.jsx'

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Caretaker />} />
        </Routes>
      </Router>
    </div>
  )
}
