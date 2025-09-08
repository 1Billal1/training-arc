// src/components/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import styles from './layout.module.css';

function Layout() {
  return (
    <div className={styles.appLayout}>
      <Navbar />
      <main className={styles.mainContent}>
        {/* Outlet is a placeholder where the child route (Dashboard, Leaderboard) will be rendered */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;