// src/components/Navbar.jsx

import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import ThemeToggle from './ThemeToggle'; // Import ThemeToggle
import styles from './navbar.module.css';

function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location object

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
    case '/home':
      pageTitle = 'Dashboard';
      break;
    case '/leaderboard':
      pageTitle = 'Leaderboard';
      break;
    case '/profile': 
      pageTitle = 'Profile';
      break; 
    default:
      pageTitle = 'Dashboard';
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        {/* Dynamic page title */}
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <p className={styles.userInfo}>
          Logged in as: {currentUser?.displayName || currentUser?.email}
        </p>
      </div>
      <div className={styles.navRight}>
        <NavLink 
          to="/home" 
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

        {/* Theme toggle button */}
        <ThemeToggle />

        {/* Logout button */}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
