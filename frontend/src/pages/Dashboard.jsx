import { useState, useEffect, useCallback } from "react";
import { auth, db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, doc, deleteDoc, runTransaction, increment } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { battlepassTiers } from '../battlepass-config';

import AddRun from "./addRun";
import Modal from "../components/Modal";
import RunSidebar from "../components/RunSidebar";
import ProgressBar from "../pages/ProgressBar";
import styles from './Dashboard.module.css';

function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [runs, setRuns] = useState([]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(true);

  const fetchRuns = useCallback(async () => {
    if (!currentUser) return;
    setIsLoadingRuns(true);
    try {
      const q = query(
        collection(db, "runs"),
        where("userId", "==", currentUser.uid),
        orderBy("runDate", "asc")
      );
      const snapshot = await getDocs(q);
      const runList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRuns(runList);
    } catch (err) {
      console.error("Error fetching runs:", err);
    }
    setIsLoadingRuns(false);
  }, [currentUser]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  const updateUserStatsAndRewards = async (distanceChange) => {
    if (!currentUser) return;
    const userDocRef = doc(db, "users", currentUser.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists()) {
          console.error("User document does not exist!");
          return;
        }

        const currentDistance = userDoc.data()?.totalDistance || 0;
        const newTotalDistance = currentDistance + distanceChange;
        
        const currentTiers = userDoc.data()?.unlockedTiers || [];
        const newUnlockedTiers = battlepassTiers // <-- FIX: Changed to battlepassTiers
          .filter(level => newTotalDistance >= level.kmRequired)
          .map(level => level.tier);

        const updatedTiers = [...new Set([...currentTiers, ...newUnlockedTiers])];

        transaction.update(userDocRef, {
          totalDistance: increment(distanceChange),
          unlockedTiers: updatedTiers
        });
      });
      console.log("User stats and rewards updated successfully.");
    } catch (e) {
      console.error("Transaction failed to update user stats: ", e);
    }
  };

  const handleAddRunSuccess = (addedRunData) => {
    setIsModalOpen(false);
    updateUserStatsAndRewards(addedRunData.totalDistance);
    fetchRuns();
  };

  const handleDeleteRun = async (runIdToDelete) => {
    const runToDelete = runs.find(r => r.id === runIdToDelete);
    if (!runToDelete) return;

    if (window.confirm("Are you sure you want to delete this run?")) {
      try {
        await deleteDoc(doc(db, "runs", runIdToDelete));
        updateUserStatsAndRewards(-runToDelete.totalDistance);
        fetchRuns();
      } catch (error) {
        console.error("Error deleting run: ", error);
        alert("Failed to delete the run. Please try again.");
      }
    }
  };

  const graphData = runs
    .filter(run => run.runDate && run.totalTimeSeconds > 0)
    .map(run => {
      const timeInHours = run.totalTimeSeconds / 3600;
      return {
        date: run.runDate.toDate().toLocaleDateString('en-GB'),
        time: Math.round(run.totalTimeSeconds / 60),
        speed: timeInHours > 0 ? parseFloat((run.totalDistance / timeInHours).toFixed(2)) : 0,
        distance: run.totalDistance,
      };
    });

  const totalDistanceRan = runs.reduce((sum, run) => sum + run.totalDistance, 0);
  const totalTimeRanSeconds = runs.reduce((sum, run) => sum + run.totalTimeSeconds, 0);
  const totalTimeRanHours = totalTimeRanSeconds / 3600;

  const distanceGoal = 250;
  const timeGoal = 36;
  const distanceMilestones = [
    { value: 42.2, label: 'Marathon (42.2 km)' },
    { value: 100, label: '100 km' },
    { value: 150, label: '150 km' },
    { value: 200, label: '200 km' }
  ];

  return (
    <div className={styles.dashboardGrid}>
      <RunSidebar 
        runs={runs} 
        isLoading={isLoadingRuns} 
        onDeleteRun={handleDeleteRun} 
      />
      
      <main className={styles.mainContent}>
        <div className={styles.contentCard}>
          <div className={styles.actionsContainer}>
            <h2>Your Runs</h2>
            <button onClick={() => setIsModalOpen(true)} className={styles.primaryButton}>
              Add a New Run
            </button>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.chartContainer}>
              <h3>Run Time</h3>
              <ResponsiveContainer>
                <LineChart data={graphData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} /><Tooltip /><Legend /><Line type="monotone" dataKey="time" name="Time (min)" stroke="#f97316" strokeWidth={2} /></LineChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.chartContainer}>
              <h3>Average Speed</h3>
              <ResponsiveContainer>
                <LineChart data={graphData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis label={{ value: 'km/h', angle: -90, position: 'insideLeft' }} /><Tooltip /><Legend /><Line type="monotone" dataKey="speed" name="Speed (km/h)" stroke="#3b82f6" strokeWidth={2} /></LineChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.chartContainer}>
              <h3>Distance</h3>
              <ResponsiveContainer>
                <LineChart data={graphData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis label={{ value: 'km', angle: -90, position: 'insideLeft' }} /><Tooltip /><Legend /><Line type="monotone" dataKey="distance" name="Distance (km)" stroke="#16a34a" strokeWidth={2} /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.progressSection}>
            <h3>Overall Progress</h3>
            <div className={styles.progressBarsContainer}>
              <ProgressBar 
                label="Total Distance"
                value={totalDistanceRan}
                goal={distanceGoal}
                unit="km"
                milestones={distanceMilestones}
              />
              <ProgressBar 
                label="Total Time"
                value={totalTimeRanHours}
                goal={timeGoal}
                unit="hours"
              />
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddRun onSuccess={handleAddRunSuccess} />
      </Modal>
    </div>
  );
}

export default Dashboard;