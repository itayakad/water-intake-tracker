import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Quiz from './components/Quiz'
import Dashboard from './components/Dashboard'
import CalorieTracker from './components/CalorieTracker'
import ExerciseTracker from './components/ExerciseTracker'
import Home from './components/Home'
import Profile from './components/Profile'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/water" element={<Dashboard />} />
          <Route path="/calories" element={<CalorieTracker />} />
          <Route path="/exercise" element={<ExerciseTracker />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
