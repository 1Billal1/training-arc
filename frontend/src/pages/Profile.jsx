// src/pages/Profile.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 
import styles from './profile.module.css';

function Profile() {
  const { currentUser } = useAuth();
  const [newUsername, setNewUsername] = useState(currentUser?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setMessage('Username cannot be empty.');
      return;
    }
    if (newUsername === currentUser.displayName) {
        setMessage('You set the same username.');
        return;
    }

    setLoading(true);
    setMessage('');
    try {
      // 1. Update the profile in Firebase Authentication
      await updateProfile(auth.currentUser, {
        displayName: newUsername
      });

      // 2. Create/Update the user's document in the "users" collection
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, {
        username: newUsername,
        email: currentUser.email 
      }, { merge: true }); 

      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error("Failed to update profile", error);
      setMessage('Error updating profile. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Your Profile</h2>
        <p className={styles.infoText}>Your email: <strong>{currentUser?.email}</strong></p>
        <form onSubmit={handleUpdateProfile} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className={styles.inputField}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          {message && <p className={styles.message}>{message}</p>}
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;