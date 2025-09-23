// src/components/Navbar.jsx

import React from 'react'; // <-- It's good practice to always import React
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import ThemeToggle from './ThemeToggle';
import styles from './navbar.module.css';

function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Determine the page title based on the current URL pathname
  let pageTitle = 'Dashboard'; // Default title
  switch (location.pathname) {
    // --- FIX: Changed '/home' to '/dashboard' to match the routes in App.jsx ---
    case '/dashboard':
      pageTitle = 'Dashboard';
      break;
    case '/leaderboard':
      pageTitle = 'Leaderboard';
      break;
    case '/profile': 
      pageTitle = 'Profile';
      break;
    case '/battlepass':
      pageTitle = 'Battle Pass';
      break;
    default:
      pageTitle = 'Dashboard';
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <p className={styles.userInfo}>
          Logged in as: {currentUser?.displayName || currentUser?.email}
        </p>
      </div>
      <div className={styles.navRight}>
        {/* --- FIX: Changed link to '/dashboard' --- */}
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/leaderboard" 
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
        >
          Leaderboard
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
        >
          Profile
        </NavLink>
        <NavLink 
          to="/battlepass" 
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
        >
          Battle Pass
        </NavLink>

        <ThemeToggle />

        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;