import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteUser } from 'firebase/auth';
import './Profile.css';

interface UserData {
  height: number;
  weight: number;
  age: number;
  gender: string;
  activityLevel: string;
  units: 'metric' | 'imperial';
  weeklyExerciseGoal: number;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      alert('Please complete the quiz first');
      navigate('/');
      return;
    }
    setUserData(JSON.parse(storedUserData));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setError('');
      setLoading(true);
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    try {
      setError('');
      setLoading(true);
      await deleteUser(currentUser);
      localStorage.clear(); // Clear all local storage data
      navigate('/register');
    } catch (err) {
      setError('Failed to delete account. You may need to re-login first.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatHeight = (height: number, units: 'metric' | 'imperial') => {
    if (units === 'metric') {
      return `${height}cm`;
    } else {
      const feet = Math.floor(height);
      const inches = Math.round((height - feet) * 12);
      return `${feet}'${inches}"`;
    }
  };

  const formatWeight = (weight: number, units: 'metric' | 'imperial') => {
    return `${weight}${units === 'metric' ? 'kg' : 'lbs'}`;
  };

  if (!userData) return null;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="card">
        <div className="profile-info">
          <div className="info-group">
            <h3>Height</h3>
            <p>{formatHeight(userData.height, userData.units)}</p>
          </div>
          <div className="info-group">
            <h3>Weight</h3>
            <p>{formatWeight(userData.weight, userData.units)}</p>
          </div>
          <div className="info-group">
            <h3>Age</h3>
            <p>{userData.age}</p>
          </div>
          <div className="info-group">
            <h3>Gender</h3>
            <p>{userData.gender}</p>
          </div>
          <div className="info-group">
            <h3>Activity Level</h3>
            <p>{userData.activityLevel}</p>
          </div>
          <div className="info-group">
            <h3>Units</h3>
            <p>{userData.units}</p>
          </div>
          <div className="info-group">
            <h3>Weekly Exercise Goal</h3>
            <p>{userData.weeklyExerciseGoal} days</p>
          </div>
        </div>
        <div className="button-group">
          <button onClick={() => navigate('/quiz')} className="change-answers-button">
            Change Answers
          </button>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
        <div className="button-group account-actions">
          <button 
            onClick={handleLogout} 
            disabled={loading} 
            className="logout-button"
          >
            {loading ? 'Logging out...' : 'Log Out'}
          </button>
          <button 
            onClick={handleDeleteAccount} 
            disabled={loading}
            className="delete-account-button"
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 