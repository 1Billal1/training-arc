// src/pages/ProgressBar.jsx

import React from 'react';
import styles from './progressBar.module.css';

function ProgressBar({ label, value, goal, unit, milestones = [] }) {
  // Calculate the percentage, ensuring it doesn't go over 100%
  const percentage = Math.min((value / goal) * 100, 100);

  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.header}>
        <h4 className={styles.label}>{label}</h4>
        <span className={styles.progressText}>
          {value.toFixed(1)} / {goal} {unit}
        </span>
      </div>
      <div className={styles.track}>
        <div 
          className={styles.fill} 
          style={{ width: `${percentage}%` }} 
        />
        {/* Render milestones if they exist */}
        {milestones.map((milestone, index) => {
          const milestonePercentage = Math.min((milestone.value / goal) * 100, 100);
          return (
            <div 
              key={index} 
              className={styles.milestone} 
              style={{ left: `${milestonePercentage}%` }}
              title={`${milestone.label || milestone.value} ${unit}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;