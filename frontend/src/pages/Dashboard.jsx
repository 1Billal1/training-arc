// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddRun from "./addRun";
import Modal from "../components/Modal";
import styles from './dashboard.module.css'; 
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; 

// Dummy RunItem component for demonstration
function RunItem({ run }) {
  // Show date and total time
  const date = run.createdAt?.toDate?.() ? run.createdAt.toDate().toLocaleDateString() : '';
  const totalTimeMin = Math.round((run.totalTimeMilliseconds || 0) / 60000);
  return (
    <div>
      <strong>{date}</strong> - {totalTimeMin} min, {run.totalDistance} km
    </div>
  );
}

function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [runs, setRuns] = useState([]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(true);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Fetch runs from Firestore
  const fetchRuns = async () => {
    if (!currentUser) return;
    setIsLoadingRuns(true);
    try {
      const q = query(
        collection(db, "runs"),
        where("userId", "==", currentUser.uid)
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
  };

  useEffect(() => {
    fetchRuns();
    // eslint-disable-next-line
  }, [currentUser, isModalOpen]); // refetch when modal closes (new run added)

  // Prepare data for the graph
  const graphData = runs
    .filter(run => run.createdAt && run.totalTimeMilliseconds)
    .map(run => ({
      date: run.createdAt?.toDate?.() ? run.createdAt.toDate().toLocaleDateString() : '',
      timeMin: Math.round((run.totalTimeMilliseconds || 0) / 60000),
      distance: run.totalDistance
    }));

  return (
    <div className={styles.dashboardContainer}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.welcomeMessage}>
          <h1>Dashboard</h1>
          <p>Logged in as: <strong>{currentUser?.email}</strong></p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.actionsContainer}>
          <h2>Your Runs</h2>
          <button onClick={() => setIsModalOpen(true)} className={styles.primaryButton}>
            Add a New Run
          </button>
        </div>

        {/* --- Run Times Graph --- */}
        <div style={{ width: '100%', height: 300, marginBottom: 32 }}>
          <h3>Run Times Over Time</h3>
          <ResponsiveContainer>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="timeMin" stroke="#f97316" name="Run Time (min)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.runList}>
          {isLoadingRuns ? (
            <p>Loading your runs...</p>
          ) : runs.length > 0 ? (
            runs.map(run => (
              <RunItem key={run.id} run={run} />
            ))
          ) : (
            <p>No runs recorded yet. Click "Add a New Run" to get started!</p>
          )}
        </div>
      </main>

      {/* The Modal for adding a new run */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddRun onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default Dashboard;