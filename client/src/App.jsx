import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Caretaker from './pages/caretaker.jsx';

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
