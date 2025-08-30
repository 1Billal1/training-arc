// /pages/addRun.jsx
import React, { useState, useEffect } from "react";
import styles from './addRun.module.css';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const parseTimeToMilliseconds = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  const milliseconds = parseInt(parts[2], 10) || 0;
  return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
};

const formatTotalTime = (totalMilliseconds) => {
  if (totalMilliseconds <= 0) return "0sec";
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
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

  useEffect(() => {
    const newLapCount = parseInt(lapsInput, 10) || 0;
    setNumLaps(newLapCount);
    setLapTimes(currentTimes => {
      const newTimes = Array(newLapCount).fill("");
      for (let i = 0; i < Math.min(newLapCount, currentTimes.length); i++) {
        newTimes[i] = currentTimes[i];
      }
      return newTimes;
    });
  }, [lapsInput]);

  const handleLapTimeChange = (index, value) => {
    const newLapTimes = [...lapTimes];
    newLapTimes[index] = value;
    setLapTimes(newLapTimes);
  };

  const getTotalMilliseconds = () => {
    return lapTimes.reduce((sum, timeStr) => sum + parseTimeToMilliseconds(timeStr), 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!totalDistance || numLaps <= 0 || !currentUser) {
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
        totalTimeMilliseconds: getTotalMilliseconds(),
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

      {/* The main form now handles submission */}
      <form onSubmit={handleSubmit} className={styles.runForm}>
        <div>
          <h3 className={styles.inputLabel}>Number of Laps</h3>
          <input
            type="number"
            min="0"
            placeholder="Number of Laps"
            className={styles.runInputField} 
            value={lapsInput}
            onChange={(e) => setLapsInput(e.target.value)}
          />
        </div>
        
        <div>
          <h3 className={styles.inputLabel}>Total Distance (km)</h3>
          <input
            type="number"
            placeholder="Total Distance (km)"
            className={styles.runInputField} // Apply single input style
            value={totalDistance}
            onChange={(e) => setTotalDistance(e.target.value)}
          />
        </div>

        {numLaps > 0 && (
          <div className={styles.lapInputs}>
            <h3 className={styles.inputLabel}>Enter Times for Each Lap:</h3>
            {Array.from({ length: numLaps }).map((_, index) => (
              <div key={index}> {/* Removed runInputGroup for simplicity */}
                <label>Lap {index + 1} ({lapDistance} km):</label>
                <input
                  type="text"
                  placeholder="MM:SS:MS"
                  className={styles.runInputField}
                  value={lapTimes[index] || ""}
                  onChange={(e) => handleLapTimeChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {numLaps > 0 && lapTimes.some(t => t) && (
          <div className={styles.lapList}>
            <h3>Laps Summary:</h3>
            {lapTimes.map((time, index) => {
              if (!time) return null;
              return (
                <div key={index}>
                  Lap {index + 1}: {lapDistance} km - {time}
                </div>
              );
            })}
            <h4>
              Total Time: {formatTotalTime(getTotalMilliseconds())}
            </h4>
          </div>
        )}

        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <button type="submit" className={styles.runButton} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Run"}
        </button>
      </form>
    </div>
  );
}

export default AddRun;