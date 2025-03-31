import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExerciseTracker.css';

interface UserData {
  height: number
  weight: number
  age: number
  gender: string
  activityLevel: string
  units: 'metric' | 'imperial'
  weeklyExerciseGoal: number
}

interface ExerciseDay {
  name: string;
  shortName: string;
  date: Date;
  completed: boolean;
  isToday: boolean;
  isFuture: boolean;
}

const ExerciseTracker: React.FC = () => {
  const navigate = useNavigate();
  const [weeklyGoal, setWeeklyGoal] = useState(4); // Default value will be replaced with user's goal
  const [exerciseDays, setExerciseDays] = useState<ExerciseDay[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Get user data for weekly goal
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      alert('Please complete the quiz first');
      navigate('/');
      return;
    }

    const userData: UserData = JSON.parse(storedUserData);
    setWeeklyGoal(userData.weeklyExerciseGoal);

    // Get the current date
    const today = new Date();
    const currentDay = today.getDay();

    // Get the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    // Create the week array
    const days: ExerciseDay[] = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Load saved exercise data for the current week
    const savedData = localStorage.getItem('exerciseData');
    const savedExercises = savedData ? JSON.parse(savedData) : {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split('T')[0];

      days.push({
        name: dayNames[i],
        shortName: shortDayNames[i],
        date: date,
        completed: savedExercises[dateString] || false,
        isToday: i === currentDay,
        isFuture: i > currentDay
      });
    }

    setExerciseDays(days);
    updateCompletedCount(days);
  }, [navigate]);

  const updateCompletedCount = (days: ExerciseDay[]) => {
    const completed = days.filter(day => day.completed).length;
    setCompletedCount(completed);
  };

  const toggleExercise = (index: number) => {
    if (exerciseDays[index].isFuture) return;

    const newDays = [...exerciseDays];
    newDays[index].completed = !newDays[index].completed;
    setExerciseDays(newDays);
    updateCompletedCount(newDays);

    // Save to localStorage
    const exerciseData: { [key: string]: boolean } = {};
    newDays.forEach(day => {
      const dateString = day.date.toISOString().split('T')[0];
      exerciseData[dateString] = day.completed;
    });
    localStorage.setItem('exerciseData', JSON.stringify(exerciseData));
  };

  const progress = (completedCount / weeklyGoal) * 100;

  return (
    <div className="dashboard-container">
      <h1>Exercise Tracker</h1>
      
      <div className="card">
        <div className="stats">
          <div className="stat">
            <h3>Weekly Goal</h3>
            <p className="stat-number">{weeklyGoal} days</p>
            <p className="stat-help">Target exercise days this week</p>
          </div>

          <div className="stat">
            <h3>Current Progress</h3>
            <p className="stat-number">{completedCount} days</p>
            <p className="stat-help">Completed exercise days</p>
          </div>

          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
            <p className="progress-text">{Math.round(progress)}% of weekly goal</p>
          </div>

          <div className="days-grid">
            {exerciseDays.map((day, index) => (
              <button
                key={day.name}
                onClick={() => toggleExercise(index)}
                className={`day-button ${day.completed ? 'completed' : ''} 
                  ${day.isToday ? 'today' : ''} 
                  ${day.isFuture ? 'future' : ''}`}
                disabled={day.isFuture}
              >
                <span className="day-name">{day.shortName}</span>
                <span className="check-mark">✓</span>
              </button>
            ))}
          </div>

          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTracker; 