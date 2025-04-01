import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkDSFaCAk9QqImNZ8mSuFr-1K8LmXAKtI",
  authDomain: "fitnessapp-a4565.firebaseapp.com",
  projectId: "fitnessapp-a4565",
  storageBucket: "fitnessapp-a4565.firebasestorage.app",
  messagingSenderId: "746529439304",
  appId: "1:746529439304:web:90d4f780a51809986fe27d",
  measurementId: "G-LWPYZ445HX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
export const auth = getAuth(app);
export default app; 