import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Quiz.css'

interface UserData {
  height: number
  weight: number
  age: number
  gender: 'male' | 'female'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra'
  units: 'metric' | 'imperial'
  weeklyExerciseGoal: number
}

interface FormDataState extends Omit<UserData, 'height' | 'weight' | 'age' | 'weeklyExerciseGoal'> {
  height: string
  weight: string
  age: string
  weeklyExerciseGoal: string
}

const Quiz = () => {
  const navigate = useNavigate()
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')
  const [imperialHeight, setImperialHeight] = useState({ feet: '', inches: '' })
  const [formData, setFormData] = useState<FormDataState>({
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    units: 'metric',
    weeklyExerciseGoal: '4',
  })

  const calculateWaterIntake = (data: UserData): number => {
    // Convert weight to kg if in imperial units
    const weightInKg = data.units === 'imperial' ? data.weight * 0.453592 : data.weight

    // Basic water intake calculation (ml per day)
    // Base calculation: 30ml per kg of body weight
    let baseIntake = weightInKg * 30

    // Adjust for activity level
    const activityMultipliers = {
      sedentary: 1,
      light: 1.2,
      moderate: 1.4,
      very: 1.6,
      extra: 1.8,
    }
    baseIntake *= activityMultipliers[data.activityLevel]

    return Math.round(baseIntake)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const numericData: UserData = {
      ...formData,
      height: Number(formData.height),
      weight: Number(formData.weight),
      age: Number(formData.age),
      weeklyExerciseGoal: Number(formData.weeklyExerciseGoal)
    }
    
    if (numericData.height <= 0 || numericData.weight <= 0 || numericData.age <= 0) {
      alert('Please fill in all fields with valid numbers')
      return
    }

    const dailyWaterIntake = calculateWaterIntake(numericData)
    localStorage.setItem('userData', JSON.stringify(numericData))
    localStorage.setItem('dailyWaterIntake', dailyWaterIntake.toString())
    localStorage.setItem('currentWaterIntake', '0')
    localStorage.setItem('consumedCalories', '0')
    
    navigate('/')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' || name === 'activityLevel' ? value : value
    }))
  }

  const handleImperialHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newImperialHeight = {
      ...imperialHeight,
      [name]: value
    }
    setImperialHeight(newImperialHeight)
    
    // Convert feet and inches to total feet for storage
    const feet = Number(newImperialHeight.feet) || 0
    const inches = Number(newImperialHeight.inches) || 0
    const totalFeet = feet + (inches / 12)
    setFormData(prev => ({
      ...prev,
      height: totalFeet.toString()
    }))
  }

  const toggleUnits = () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric'
    setUnits(newUnits)
    
    // Convert values only if they're not empty
    const currentHeight = Number(formData.height) || 0
    const currentWeight = Number(formData.weight) || 0
    
    setFormData(prev => ({
      ...prev,
      units: newUnits,
      height: currentHeight ? 
        (newUnits === 'metric' ? (currentHeight * 30.48).toString() : (currentHeight / 30.48).toString())
        : '',
      weight: currentWeight ?
        (newUnits === 'metric' ? (currentWeight * 0.453592).toString() : (currentWeight / 0.453592).toString())
        : ''
    }))
    
    // Update imperial height when switching to imperial units
    if (newUnits === 'imperial' && currentHeight) {
      const totalFeet = currentHeight / 30.48
      const feet = Math.floor(totalFeet)
      const inches = Math.round((totalFeet - feet) * 12)
      setImperialHeight({ 
        feet: feet.toString(),
        inches: inches.toString()
      })
    } else {
      setImperialHeight({ feet: '', inches: '' })
    }
  }

  return (
    <div className="quiz-container">
      <div className="header">
        <h1>Welcome!</h1>
        <button className="unit-toggle" onClick={toggleUnits}>
          Switch to {units === 'metric' ? 'Imperial' : 'Metric'} Units
        </button>
      </div>
      <p className="subtitle">
        Let's get started by setting up your profile. This information will help us personalize
        your water intake, calorie goals, and exercise tracking.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="height">
            Height ({units === 'metric' ? 'cm' : 'ft & in'})
          </label>
          {units === 'metric' ? (
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Enter your height in centimeters"
              required
              step="0.1"
            />
          ) : (
            <div className="imperial-height-inputs">
              <div className="imperial-input-group">
                <input
                  type="number"
                  id="feet"
                  name="feet"
                  value={imperialHeight.feet}
                  onChange={handleImperialHeightChange}
                  placeholder="Feet"
                  required
                  min="0"
                />
                <span>ft</span>
              </div>
              <div className="imperial-input-group">
                <input
                  type="number"
                  id="inches"
                  name="inches"
                  value={imperialHeight.inches}
                  onChange={handleImperialHeightChange}
                  placeholder="Inches"
                  required
                  min="0"
                  max="11"
                />
                <span>in</span>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="weight">
            Weight ({units === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder={`Enter your weight in ${units === 'metric' ? 'kilograms' : 'pounds'}`}
            required
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="activityLevel">Activity Level</label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            required
          >
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Lightly active (light exercise 1-3 days/week)</option>
            <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
            <option value="very">Very active (hard exercise 6-7 days/week)</option>
            <option value="extra">Extra active (very hard exercise & physical job)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="weeklyExerciseGoal">Weekly Exercise Goal (days)</label>
          <select
            id="weeklyExerciseGoal"
            name="weeklyExerciseGoal"
            value={formData.weeklyExerciseGoal}
            onChange={handleChange}
            required
          >
            <option value="1">1 day per week</option>
            <option value="2">2 days per week</option>
            <option value="3">3 days per week</option>
            <option value="4">4 days per week</option>
            <option value="5">5 days per week</option>
            <option value="6">6 days per week</option>
            <option value="7">7 days per week</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Start My Journey
        </button>
      </form>
    </div>
  )
}

export default Quiz 