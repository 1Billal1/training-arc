// src/pages/Leaderboard.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import LeaderboardTable from '../components/LeaderboardTable';
import styles from './leaderboard.module.css';

// --- Helper functions for formatting stats ---
const formatDistance = (distance) => `${(distance || 0).toFixed(2)} km`;

const formatTime = (totalSeconds) => {
    // Handle potential NaN or undefined values
    if (isNaN(totalSeconds) || !totalSeconds) return '0.0 hr';
    const hours = totalSeconds / 3600;
    return `${hours.toFixed(1)} hr`;
};

const formatSpeed = (speed) => `${(speed || 0).toFixed(2)} km/h`;

function Leaderboard() {
  const [distanceBoard, setDistanceBoard] = useState([]);
  const [timeBoard, setTimeBoard] = useState([]);
  const [speedBoard, setSpeedBoard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Step 1: Fetch all user profiles and create a lookup map.
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersMap = {};
        usersSnapshot.docs.forEach(doc => {
          usersMap[doc.id] = doc.data();
        });

        // Step 2: Fetch all runs.
        const runsSnapshot = await getDocs(collection(db, "runs"));
        const allRuns = runsSnapshot.docs.map(doc => doc.data());

        // Step 3: Aggregate run stats for each user.
        const userStats = allRuns.reduce((acc, run) => {
          // Ensure we have a valid number for stats
          const distance = run.totalDistance || 0;
          const time = run.totalTimeSeconds || 0;
          
          acc[run.userId] = acc[run.userId] || { totalDistance: 0, totalTime: 0 };
          acc[run.userId].totalDistance += distance;
          acc[run.userId].totalTime += time;
          
          return acc;
        }, {});

        // Step 4: Combine aggregated stats with user profiles.
        const statsArray = Object.keys(userStats).map(userId => {
          const stats = userStats[userId];
          const userProfile = usersMap[userId];
          const totalTimeHours = stats.totalTime / 3600;
          
          return {
            userId,
            // More robust fallback logic
            username: userProfile?.username || userProfile?.email || 'User ' + userId.substring(0, 5),
            distance: stats.totalDistance,
            time: stats.totalTime,
            avgSpeed: totalTimeHours > 0 ? stats.totalDistance / totalTimeHours : 0
          };
        });

        // Step 5: Create the sorted leaderboards.
        setDistanceBoard([...statsArray].sort((a, b) => b.distance - a.distance));
        setTimeBoard([...statsArray].sort((a, b) => b.time - a.time));
        setSpeedBoard([...statsArray].sort((a, b) => b.avgSpeed - a.avgSpeed));

      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading leaderboards...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Leaderboards</h1>
      <div className={styles.grid}>
        <LeaderboardTable title="Total Distance" data={distanceBoard} statKey="distance" formatStat={formatDistance} />
        <LeaderboardTable title="Total Time" data={timeBoard} statKey="time" formatStat={formatTime} />
        <LeaderboardTable title="Average Speed" data={speedBoard} statKey="avgSpeed" formatStat={formatSpeed} />
      </div>
    </div>
  );
}

export default Leaderboard;