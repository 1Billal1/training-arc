// src/components/RunSidebar.jsx

import React from 'react';
import styles from './runSidebar.module.css';

// Helper functions (formatDate, formatTime) remain the same
const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    // This logic works for both runDate and createdAt, as both are Timestamps
    return timestamp.toDate().toLocaleDateString('en-GB'); 
};


const formatTime = (totalSeconds) => {
    const totalMinutes = Math.round(totalSeconds / 60);
    return `${totalMinutes} min`;
};


function RunSidebar({ runs, isLoading, onDeleteRun }) {
  return (
    <aside className={styles.sidebarContainer}>
      <h3 className={styles.sidebarTitle}>Recorded Runs</h3>
      <div className={styles.runList}>
        {isLoading ? (
          <p className={styles.loadingText}>Loading...</p>
        ) : runs.length > 0 ? (
          runs.map(run => (
            <div key={run.id} className={styles.runItem}>
              <strong className={styles.runDate}>{formatDate(run.runDate)}</strong>
            <p className={styles.runDetails}>
                {formatTime(run.totalTimeSeconds)}, {run.totalDistance} km
            </p>
              
              <button
                className={styles.deleteButton}
                onClick={() => onDeleteRun(run.id)}
                title="Delete run"
              >
                -
              </button>
            </div>
          ))
        ) : (
          <p className={styles.loadingText}>No runs yet.</p>
        )}
      </div>
    </aside>
  );
}

export default RunSidebar;