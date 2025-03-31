import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  units: 'metric' | 'imperial';
}

const CalorieTracker: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const storedConsumedCalories = localStorage.getItem('consumedCalories');

    if (!storedUserData) {
      alert('Please complete the quiz first');
      navigate('/');
      return;
    }

    const parsedData = JSON.parse(storedUserData);
    setUserData(parsedData);
    calculateDailyCalories(parsedData);

    if (storedConsumedCalories) {
      setConsumedCalories(parseInt(storedConsumedCalories));
    }
  }, [navigate]);

  const calculateDailyCalories = (data: UserData) => {
    // Mifflin-St Jeor Equation for BMR
    let bmr;
    const weight = data.units === 'imperial' ? data.weight * 0.453592 : data.weight; // Convert lbs to kg if imperial
    
    // Convert height from feet to cm
    let heightInCm;
    if (data.units === 'imperial') {
      // data.height is in feet (e.g., 6.25 for 6'3")
      const feet = Math.floor(data.height);
      const inches = Math.round((data.height - feet) * 12);
      const totalInches = (feet * 12) + inches;
      heightInCm = totalInches * 2.54;
    } else {
      heightInCm = data.height;
    }

    if (data.gender === 'male') {
      bmr = 10 * weight + 6.25 * heightInCm - 5 * data.age + 5;
    } else {
      bmr = 10 * weight + 6.25 * heightInCm - 5 * data.age - 161;
    }

    // Activity level multipliers
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'very': 1.725,
      'extra': 1.9
    };

    const dailyCalories = Math.round(bmr * activityMultipliers[data.activityLevel as keyof typeof activityMultipliers]);
    setDailyCalories(dailyCalories);
  };

  const handleAddCalories = (amount: number) => {
    const newTotal = consumedCalories + amount;
    setConsumedCalories(newTotal);
    localStorage.setItem('consumedCalories', newTotal.toString());

    if (newTotal >= dailyCalories) {
      alert('You have reached your daily calorie goal!');
    }
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (!isNaN(amount) && amount > 0) {
      handleAddCalories(amount);
      setCustomAmount('');
    } else {
      alert('Please enter a valid amount');
    }
  };

  const resetDaily = () => {
    setConsumedCalories(0);
    localStorage.setItem('consumedCalories', '0');
    alert('Your daily calorie intake has been reset');
  };

  if (!userData) return null;

  const progress = (consumedCalories / dailyCalories) * 100;

  return (
    <div className="dashboard-container">
      <h1>Calorie Tracker</h1>
      
      <div className="card">
        <div className="stats">
          <div className="stat">
            <h3>Daily Goal</h3>
            <p className="stat-number">{dailyCalories}</p>
            <p className="stat-help">Recommended daily calorie intake</p>
          </div>

          <div className="stat">
            <h3>Current Intake</h3>
            <p className="stat-number">{consumedCalories}</p>
            <p className="stat-help">Calories consumed today</p>
          </div>

          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
            <p className="progress-text">{Math.round(progress)}% of daily goal</p>
          </div>

          <div className="button-group">
            <button onClick={() => handleAddCalories(100)} className="add-button">
              Add 100
            </button>
            <button onClick={() => handleAddCalories(250)} className="add-button">
              Add 250
            </button>
            <button onClick={() => handleAddCalories(500)} className="add-button">
              Add 500
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

          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker; 