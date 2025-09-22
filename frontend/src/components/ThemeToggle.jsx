// src/components/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Corrected path
import styles from './themeToggle.module.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className={styles.toggleButton} title="Toggle dark mode">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;