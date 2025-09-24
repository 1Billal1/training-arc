import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import LeaderboardTable from '../components/LeaderboardTable';
import styles from './leaderboard.module.css';

const formatDistance = (distance) => `${(distance || 0).toFixed(2)} km`;
const formatTime = (totalSeconds) => {
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
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersMap = {};
        usersSnapshot.docs.forEach(doc => {
          usersMap[doc.id] = doc.data();
        });

        const runsSnapshot = await getDocs(collection(db, "runs"));
        const allRuns = runsSnapshot.docs.map(doc => doc.data());

        const userStats = allRuns.reduce((acc, run) => {
          const distance = run.totalDistance || 0;
          const time = run.totalTimeSeconds || 0;
          acc[run.userId] = acc[run.userId] || { totalDistance: 0, totalTime: 0 };
          acc[run.userId].totalDistance += distance;
          acc[run.userId].totalTime += time;
          return acc;
        }, {});

        const statsArray = Object.keys(userStats).map(userId => {
        const stats = userStats[userId];
        const userProfile = usersMap[userId];
        const totalTimeHours = stats.totalTime / 3600;
        
        return {
          userId,
          username: userProfile?.username || userProfile?.email || 'Unknown User',
          equippedBadge: userProfile?.equippedBadge,
          equippedTagline: userProfile?.equippedTagline,
          distance: stats.totalDistance,
          time: stats.totalTime,
          avgSpeed: totalTimeHours > 0 ? stats.totalDistance / totalTimeHours : 0
        };
      });

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