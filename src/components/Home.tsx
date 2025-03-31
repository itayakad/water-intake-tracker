import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="header">
          <h1>Fitness Tracker</h1>
          <button onClick={() => navigate('/profile')} className="profile-button">
            <span className="button-icon">👤</span>
            <span className="button-text">My Profile</span>
          </button>
        </div>
        <p className="subtitle">Track your daily water and calorie intake for a healthier lifestyle</p>
      </div>

      <div className="nav-buttons">
        <button onClick={() => navigate('/water')} className="nav-button water">
          <div className="button-content">
            <span className="button-icon">💧</span>
            <span className="button-text">Water Tracker</span>
            <p className="button-description">Monitor your daily water intake and stay hydrated</p>
          </div>
        </button>

        <button onClick={() => navigate('/calories')} className="nav-button calories">
          <div className="button-content">
            <span className="button-icon">🍽️</span>
            <span className="button-text">Calorie Tracker</span>
            <p className="button-description">Keep track of your daily calorie consumption</p>
          </div>
        </button>

        <button onClick={() => navigate('/exercise')} className="nav-button exercise">
          <div className="button-content">
            <span className="button-icon">💪</span>
            <span className="button-text">Exercise Tracker</span>
            <p className="button-description">Track your weekly exercise progress</p>
          </div>
        </button>
      </div>

      <footer className="home-footer">
        <p>Stay healthy, stay fit! 💪</p>
      </footer>
    </div>
  );
};

export default Home; 