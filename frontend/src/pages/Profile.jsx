import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { battlepassTiers } from '../battlepass-config';
import styles from './profile.module.css';

function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSyncing, setIsSyncing] = useState(false); // State for the sync button

  const fetchUserData = useCallback(async () => {
    if (!currentUser) return;
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      setUserData(data);
      setNewUsername(data.username || '');
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || newUsername === userData?.username) { return; }
    setLoading(true);
    setMessage('');
    try {
      await updateProfile(auth.currentUser, { displayName: newUsername });
      await updateDoc(doc(db, "users", currentUser.uid), { username: newUsername });
      setMessage('Username updated successfully!');
      fetchUserData();
    } catch (error) {
      setMessage('Error updating username.');
    }
    setLoading(false);
  };

  const handleEquipReward = async (reward) => {
    if (!currentUser || !reward) return;
    const fieldToUpdate = `equipped${reward.type.charAt(0).toUpperCase() + reward.type.slice(1)}`;
    const valueToEquip = reward.type === 'Tagline' ? reward.text : reward.imageUrl;
    try {
      await updateDoc(doc(db, "users", currentUser.uid), { [fieldToUpdate]: valueToEquip });
      fetchUserData();
    } catch (error) {
      console.error("Failed to equip item:", error);
    }
  };

  const handleUnequipReward = async (rewardType) => {
    if (!currentUser) return;
    const fieldToUpdate = `equipped${rewardType}`;
    try {
      await updateDoc(doc(db, "users", currentUser.uid), { [fieldToUpdate]: null });
      fetchUserData();
    } catch (error) {
      console.error(`Failed to unequip ${rewardType}:`, error);
    }
  };

  const handleSyncProgress = async () => {
    if (!currentUser) return;

    setIsSyncing(true);
    setMessage('Syncing progress, please wait...');
    try {
      const q = query(collection(db, "runs"), where("userId", "==", currentUser.uid));
      const runsSnapshot = await getDocs(q);

      let totalDistance = 0;
      runsSnapshot.forEach(doc => {
        totalDistance += doc.data().totalDistance;
      });

      const unlockedTiers = battlepassTiers
        .filter(level => totalDistance >= level.kmRequired)
        .map(level => level.tier);
      
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        totalDistance: totalDistance,
        unlockedTiers: unlockedTiers
      });

      setMessage('Sync successful! Your progress is now up to date.');
      fetchUserData();

    } catch (error) {
      console.error("Failed to sync progress:", error);
      setMessage('Error syncing progress. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const unlockedRewards = battlepassTiers.filter(
    tier => userData?.unlockedTiers?.includes(tier.tier)
  );
  const unlockedBadges = unlockedRewards.filter(r => r.type === 'Badge');
  const unlockedTaglines = unlockedRewards.filter(r => r.type === 'Tagline');

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Your Profile</h2>
        <p className={styles.infoText}>Your email: <strong>{currentUser?.email}</strong></p>
        <form onSubmit={handleUpdateProfile} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" className={styles.inputField} value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          </div>
          {message && <p className={styles.message}>{message}</p>}
          <button type="submit" className={styles.submitButton} disabled={loading}>{loading ? 'Updating...' : 'Save Changes'}</button>
        </form>
      </div>

      <div className={styles.rewardsSection}>
        <h2 className={styles.title}>Customize Your Profile</h2>
        
        <div className={styles.rewardCategory}>
          <h3>Badges</h3>
          <div className={styles.rewardsGrid}>
            <div className={`${styles.rewardItem} ${!userData?.equippedBadge ? styles.equipped : ''}`} onClick={() => handleUnequipReward('Badge')}>
              <span className={styles.noneText}>None</span>
            </div>
            {unlockedBadges.map(reward => (
              <div key={reward.tier} className={`${styles.rewardItem} ${userData?.equippedBadge === reward.imageUrl ? styles.equipped : ''}`} onClick={() => handleEquipReward(reward)}>
                <img src={reward.imageUrl} alt={reward.name} />
                <span>{reward.name}</span>
                {userData?.equippedBadge === reward.imageUrl && <div className={styles.equippedCheck}>✓</div>}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rewardCategory}>
          <h3>Taglines</h3>
          <div className={styles.rewardsGrid}>
            <div className={`${styles.rewardItem} ${!userData?.equippedTagline ? styles.equipped : ''}`} onClick={() => handleUnequipReward('Tagline')}>
              <span className={styles.noneText}>None</span>
            </div>
            {unlockedTaglines.map(reward => (
              <div key={reward.tier} className={`${styles.rewardItem} ${styles.taglineCard} ${userData?.equippedTagline === reward.text ? styles.equipped : ''}`} onClick={() => handleEquipReward(reward)}>
                <span className={styles.taglineText}>{reward.text}</span>
                <span className={styles.rewardName}>{reward.name}</span>
                {userData?.equippedTagline === reward.text && <div className={styles.equippedCheck}>✓</div>}
              </div>
            ))}
          </div>
        </div>

        {/* --- This is the re-added Sync Section --- */}
        <div className={styles.syncSection}>
          <h3 className={styles.title}>Account Sync</h3>
          <p className={styles.infoText}>If your Battle Pass progress seems incorrect, click here to re-calculate it from your entire run history.</p>
          <button onClick={handleSyncProgress} className={styles.syncButton} disabled={isSyncing}>
            {isSyncing ? 'Syncing...' : 'Sync My Progress'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;