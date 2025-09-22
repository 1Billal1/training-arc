// /pages/addRun.jsx
import React, { useState, useEffect } from "react";
import styles from './addRun.module.css';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios'; // Use our central API client

// Helper functions (getTodayDateString, etc.) remain the same...
const getTodayDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const todayWithOffset = new Date(today.getTime() - (offset*60*1000));
  return todayWithOffset.toISOString().split('T')[0];
}
const parseTimeToSeconds = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  return ((parseInt(parts[0], 10) || 0) * 60) + (parseInt(parts[1], 10) || 0);
};
const formatTotalTime = (totalSeconds) => {
  if (totalSeconds <= 0) return "0sec";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (hours > 0) parts.push(`${hours}hr`);
  if (minutes > 0) parts.push(`${minutes}min`);
  if (seconds > 0) parts.push(`${seconds}sec`);
  return parts.join(' ');
};

function AddRun({ onSuccess }) {
  const { currentUser } = useAuth();
  const [lapsInput, setLapsInput] = useState('1'); 
  const [numLaps, setNumLaps] = useState(1);
  const [totalDistance, setTotalDistance] = useState('');
  const [lapTimes, setLapTimes] = useState([""]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [runDate, setRunDate] = useState(getTodayDateString());
  const [isRanked, setIsRanked] = useState(false); // NEW: State for ranked toggle

  useEffect(() => {
    // This effect logic remains the same
    const newLapCount = parseInt(lapsInput, 10) || 0;
    setNumLaps(newLapCount);
    setLapTimes(currentTimes => {
      const newTimes = Array(newLapCount).fill("");
      for(let i = 0; i < Math.min(newLapCount, currentTimes.length); i++) {
        newTimes[i] = currentTimes[i];
      }
      return newTimes;
    });
  }, [lapsInput]);

  const handleLapTimeChange = (index, value) => {
    // This function remains the same
    const newLapTimes = [...lapTimes];
    const digits = value.replace(/\D/g, '');
    let formattedTime = '';
    if (digits.length > 0) {
      formattedTime = digits.length > 2 ? digits.slice(0, 2) : digits;
      if (digits.length > 2) {
        formattedTime += ':' + digits.slice(2, 4);
      }
    }
    newLapTimes[index] = formattedTime;
    setLapTimes(newLapTimes);
  };

  const getTotalSeconds = () => {
    return lapTimes.reduce((sum, timeStr) => sum + parseTimeToSeconds(timeStr), 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!totalDistance || !runDate || numLaps <= 0 || !currentUser) {
        setError("Please fill in all fields.");
        return;
    }
    setIsSubmitting(true);
    setError('');

    const runData = {
        userId: currentUser.uid,
        totalDistance: parseFloat(totalDistance),
        numLaps: numLaps,
        lapTimes: lapTimes.filter(t => t),
        totalTimeSeconds: getTotalSeconds(),
        runDate: runDate + 'T00:00:00', // Send as ISO string
        isRanked: isRanked // Include the ranked status
    };

    try {
        // --- NEW: Use apiClient to send data to our backend ---
        await apiClient.post('/api/runs', runData);
        if (onSuccess) {
            onSuccess();
        }
    } catch (err) {
        console.error("Error adding document: ", err);
        setError(err.response?.data || "Failed to save run. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const lapDistance = numLaps > 0 && totalDistance ? (parseFloat(totalDistance) / numLaps).toFixed(2) : 0;

  return (
    <div className={styles.runFormContainer}>
      <h2 className={styles.runTitle}>Add a New Run</h2>
      <form onSubmit={handleSubmit} className={styles.runForm}>
        {/* ... Date, Laps, Distance inputs ... */}
        <div>
          <h3 className={styles.inputLabel}>Date of Run</h3>
          <input type="date" className={styles.runInputField} value={runDate} onChange={(e) => setRunDate(e.target.value)} />
        </div>
        <div>
          <h3 className={styles.inputLabel}>Number of Laps</h3>
          <input type="number" min="0" placeholder="Laps" className={styles.runInputField} value={lapsInput} onChange={(e) => setLapsInput(e.target.value)} />
        </div>
        <div>
          <h3 className={styles.inputLabel}>Total Distance (km)</h3>
          <input type="number" placeholder="Distance Ran" className={styles.runInputField} value={totalDistance} onChange={(e) => setTotalDistance(e.target.value)} />
        </div>
        
        {/* --- NEW: Ranked Toggle --- */}
        <div className={styles.toggleContainer}>
          <label htmlFor="rankedToggle" className={styles.toggleLabel}>
            Ranked Mode
            <span className={styles.toggleSublabel}>This run will affect your ELO rating</span>
          </label>
          <input 
            type="checkbox" 
            id="rankedToggle"
            className={styles.toggleCheckbox} 
            checked={isRanked} 
            onChange={(e) => setIsRanked(e.target.checked)} 
          />
        </div>

        {numLaps > 0 && (
          // ... Lap inputs and summary section ...
          <div className={styles.lapInputs}>
            <h3 className={styles.inputLabel}>Enter Times for Each Lap:</h3>
            <div className={styles.lapGridContainer}>
              {Array.from({ length: numLaps }).map((_, index) => (
                <div key={index} className={styles.lapItem}>
                  <label>Lap {index + 1} ({lapDistance} km):</label>
                  <input type="text" placeholder="MM:SS" maxLength="5" className={styles.runInputField} value={lapTimes[index] || ""} onChange={(e) => handleLapTimeChange(index, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        )}
        {numLaps > 0 && lapTimes.some(t => t) && (
          <div className={styles.lapList}>
            <h3>Laps Summary:</h3>
            {lapTimes.map((time, index) => !time ? null : <div key={index}>Lap {index + 1}: {lapDistance} km - {time}</div>)}
            <h4>Total Time: {formatTotalTime(getTotalSeconds())}</h4>
          </div>
        )}
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button type="submit" className={styles.runButton} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Run"}</button>
      </form>
    </div>
  );
}

export default AddRun;