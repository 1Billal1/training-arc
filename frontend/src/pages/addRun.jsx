// /pages/addRun.jsx
import React, { useState, useEffect } from "react";
import styles from './addRun.module.css';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

// Returns today's date in YYYY-MM-DD format for the date input default
const getTodayDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const todayWithOffset = new Date(today.getTime() - (offset*60*1000));
  return todayWithOffset.toISOString().split('T')[0];
}

// Parses a time string (MM:SS) into total seconds
const parseTimeToSeconds = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  return (minutes * 60) + seconds;
};

// Formats total seconds into a human-readable string (e.g., "1hr 14min 39sec")
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
  // New state for the run date, defaults to today
  const [runDate, setRunDate] = useState(getTodayDateString());

  useEffect(() => {
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

  // New input masking function for automatic time formatting
  const handleLapTimeChange = (index, value) => {
    const newLapTimes = [...lapTimes];
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    let formattedTime = '';
    if (digits.length > 0) {
      // Add leading zero if minutes are a single digit
      formattedTime = digits.length > 2 ? digits.slice(0, 2) : digits;
      if (digits.length > 2) {
        // Add colon and the rest of the digits
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
    // Validation check
    if (!totalDistance || !runDate || numLaps <= 0 || !currentUser) {
        setError("Please fill in all fields.");
        return;
    }
    setIsSubmitting(true);
    setError('');

    // Prepare data for Firestore
    const runData = {
        userId: currentUser.uid,
        totalDistance: parseFloat(totalDistance),
        numLaps: numLaps,
        lapTimes: lapTimes.filter(t => t),
        totalTimeSeconds: getTotalSeconds(),
        runDate: Timestamp.fromDate(new Date(runDate + 'T00:00:00')), 
        createdAt: serverTimestamp()
    };

    try {
        await addDoc(collection(db, "runs"), runData);
        if (onSuccess) {
            onSuccess();
        }
    } catch (err) {
        console.error("Error adding document: ", err);
        setError("Failed to save run. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const lapDistance = numLaps > 0 && totalDistance ? (parseFloat(totalDistance) / numLaps).toFixed(2) : 0;

  return (
    <div className={styles.runFormContainer}>
      <h2 className={styles.runTitle}>Add a New Run</h2>
      <form onSubmit={handleSubmit} className={styles.runForm}>
        {/* Date Input */}
        <div>
          <h3 className={styles.inputLabel}>Date of Run</h3>
          <input
            type="date"
            className={styles.runInputField}
            value={runDate}
            onChange={(e) => setRunDate(e.target.value)}
          />
        </div>
        
        {/* Laps and Distance Inputs */}
        <div>
          <h3 className={styles.inputLabel}>Number of Laps</h3>
          <input type="number" min="0" placeholder="Laps" className={styles.runInputField} value={lapsInput} onChange={(e) => setLapsInput(e.target.value)} />
        </div>
        <div>
          <h3 className={styles.inputLabel}>Total Distance (km)</h3>
          <input type="number" placeholder="Distance Ran" className={styles.runInputField} value={totalDistance} onChange={(e) => setTotalDistance(e.target.value)} />
        </div>

        {/* Lap Times Section */}
        {numLaps > 0 && (
          <div className={styles.lapInputs}>
            <h3 className={styles.inputLabel}>Enter Times for Each Lap:</h3>
            <div className={styles.lapGridContainer}>
              {Array.from({ length: numLaps }).map((_, index) => (
                <div key={index} className={styles.lapItem}>
                  <label>Lap {index + 1} ({lapDistance} km):</label>
                  <input
                    type="text"
                    placeholder="MM:SS"
                    maxLength="5"
                    className={styles.runInputField}
                    value={lapTimes[index] || ""}
                    onChange={(e) => handleLapTimeChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Laps Summary Section */}
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