// src/pages/Home.jsx

import React from "react";
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { useNavigate } from 'react-router-dom';

function Home() {
  // Get the currentUser and navigate function from hooks
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // On successful logout, navigate directly to the sign-in page.
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className='home-container'>
      <h1>Welcome!</h1>
      <p>You are logged in as: <strong>{currentUser?.email}</strong></p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
   
export default Home;