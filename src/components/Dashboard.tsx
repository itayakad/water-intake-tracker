import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

interface UserData {
  height: number
  weight: number
  age: number
  gender: 'male' | 'female'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra'
  units: 'metric' | 'imperial'
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [dailyWaterIntake, setDailyWaterIntake] = useState(0)
  const [currentWaterIntake, setCurrentWaterIntake] = useState(0)
  const [customAmount, setCustomAmount] = useState('')

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')
    const storedDailyIntake = localStorage.getItem('dailyWaterIntake')
    const storedCurrentIntake = localStorage.getItem('currentWaterIntake')

    if (!storedUserData || !storedDailyIntake) {
      alert('Please complete the quiz first')
      navigate('/')
      return
    }

    setUserData(JSON.parse(storedUserData))
    setDailyWaterIntake(Number(storedDailyIntake))
    setCurrentWaterIntake(Number(storedCurrentIntake))
  }, [navigate])

  const addWater = (amount: number) => {
    const newIntake = currentWaterIntake + amount
    setCurrentWaterIntake(newIntake)
    localStorage.setItem('currentWaterIntake', newIntake.toString())

    if (newIntake >= dailyWaterIntake) {
      alert('Congratulations! You have reached your daily water intake goal!')
    }
  }

  const handleCustomAdd = () => {
    const amount = Number(customAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }
    addWater(amount)
    setCustomAmount('')
  }

  const resetDaily = () => {
    setCurrentWaterIntake(0)
    localStorage.setItem('currentWaterIntake', '0')
    alert('Your daily water intake has been reset')
  }

  if (!userData) return null

  const progress = (currentWaterIntake / dailyWaterIntake) * 100

  const formatHeight = (height: number, units: 'metric' | 'imperial') => {
    if (units === 'metric') {
      return `${height}cm`
    } else {
      const feet = Math.floor(height)
      const inches = Math.round((height - feet) * 12)
      return `${feet}'${inches}"`
    }
  }

  const formatWeight = (weight: number, units: 'metric' | 'imperial') => {
    return `${weight}${units === 'metric' ? 'kg' : 'lbs'}`
  }

  return (
    <div className="dashboard-container">
      <h1>Water Intake Tracker</h1>
      
      <div className="card">
        <div className="stats">
          <div className="stat">
            <h3>Daily Goal</h3>
            <p className="stat-number">{dailyWaterIntake}ml</p>
            <p className="stat-help">Recommended daily water intake</p>
          </div>

          <div className="stat">
            <h3>Current Intake</h3>
            <p className="stat-number">{currentWaterIntake}ml</p>
            <p className="stat-help">Water consumed today</p>
          </div>

          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
            <p className="progress-text">{Math.round(progress)}% of daily goal</p>
          </div>

          <div className="button-group">
            <button onClick={() => addWater(250)} className="add-button">
              Add 250ml
            </button>
            <button onClick={() => addWater(500)} className="add-button">
              Add 500ml
            </button>
            <div className="custom-input-group">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Custom amount"
                min="1"
                className="custom-input"
              />
              <button onClick={handleCustomAdd} className="add-button">
                Add
              </button>
            </div>
          </div>

          <button onClick={resetDaily} className="reset-button">
            Reset Daily Intake
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Your Profile</h2>
        <div className="profile-info">
          <p>Height: {formatHeight(userData.height, userData.units)}</p>
          <p>Weight: {formatWeight(userData.weight, userData.units)}</p>
          <p>Age: {userData.age}</p>
          <p>Gender: {userData.gender}</p>
          <p>Activity Level: {userData.activityLevel}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 