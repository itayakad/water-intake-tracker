import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Quiz from './components/Quiz'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
