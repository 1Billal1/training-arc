// frontend/src/pages/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import styles from './leaderboard.module.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/api/leaderboard');
        setLeaderboard(response.data);
      } catch (err) {
        setError('Could not fetch leaderboard data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Leaderboard</h1>
      {/* --- UPDATED: Subtitle --- */}
      <p className={styles.subtitle}>Top 100 runners by Training Score</p>

      {isLoading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      
      {!isLoading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.leaderboardTable}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                {/* --- UPDATED: Table Header --- */}
                <th>Training Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.uid}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  {/* --- UPDATED: Display trainingScore --- */}
                  <td>{user.trainingScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;