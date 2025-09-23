// src/pages/BattlePass.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { battlepassTiers, TIERS_PER_PAGE } from '../battlepass-config';
import ProgressBar from './ProgressBar';
import styles from './battlepass.module.css';

function BattlePass() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const tiersPerPage = TIERS_PER_PAGE;
  const totalPages = Math.ceil(battlepassTiers.length / tiersPerPage);

  const fetchUserData = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Calculate user progress data
  const totalDistance = userData?.totalDistance || 0;
  const unlockedTiers = userData?.unlockedTiers || [];

  const currentTier = battlepassTiers
    .filter(level => unlockedTiers.includes(level.tier))
    .sort((a, b) => b.tier - a.tier)[0];
  
  const nextTier = battlepassTiers.find(level => level.tier === ((currentTier?.tier || 0) + 1));

  const progressValue = totalDistance - (currentTier?.kmRequired || 0);
  const progressGoal = nextTier ? nextTier.kmRequired - (currentTier?.kmRequired || 0) : progressValue;

  // Auto-navigate to current tier's page - moved BEFORE conditional return
  useEffect(() => {
    if (currentTier && !isLoading) {
      const tierPage = Math.floor((currentTier.tier - 1) / tiersPerPage);
      setCurrentPage(tierPage);
    }
  }, [currentTier, tiersPerPage, isLoading]);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading Battle Pass...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header with Logo */}
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/battlepass-logo.jpg" alt="Battle Pass" className={styles.logo} />
          <h1>Running Battle Pass</h1>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Distance</span>
            <span className={styles.statValue}>{totalDistance} km</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Tiers Unlocked</span>
            <span className={styles.statValue}>{unlockedTiers.length}/{battlepassTiers.length}</span>
          </div>
        </div>
      </div>

      <div className={styles.progressCard}>
        <h2>Your Progress</h2>
        <div className={styles.currentTierInfo}>
          <div className={styles.tierBadge}>
            <span className={styles.tierNumber}>Tier {currentTier?.tier || 0}</span>
            <span className={styles.tierName}>{currentTier?.name || 'Beginner'}</span>
          </div>
          <div className={styles.distanceInfo}>
            <p>Next tier at: <strong>{nextTier?.kmRequired || 'Max Level'} km</strong></p>
            <p>Remaining: <strong>{nextTier ? nextTier.kmRequired - totalDistance : 0} km</strong></p>
          </div>
        </div>
        
        {nextTier ? (
          <ProgressBar 
            label={`Progress to Tier ${nextTier.tier}: ${nextTier.name}`}
            value={progressValue > 0 ? progressValue : 0}
            goal={progressGoal > 0 ? progressGoal : 1}
            unit="km"
          />
        ) : (
          <div className={styles.maxTierReached}>
            <h3>🎉 Maximum Tier Reached! 🎉</h3>
            <p>You've completed all {battlepassTiers.length} tiers! You're a running legend!</p>
          </div>
        )}
      </div>

      <div className={styles.rewardsContainer}>
        <div className={styles.rewardsHeader}>
          <h2>Reward Tiers</h2>
          <div className={styles.pageNavigation}>
            <button 
              className={styles.navButton} 
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              ← Previous
            </button>
            
            <div className={styles.pageDots}>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`${styles.pageDot} ${currentPage === index ? styles.active : ''}`}
                  onClick={() => goToPage(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button 
              className={styles.navButton} 
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            >
              Next →
            </button>
          </div>
        </div>

        <div className={styles.rewardsScroller}>
          <div 
            className={styles.rewardsTrack}
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div key={pageIndex} className={styles.rewardsPage}>
                {battlepassTiers
                  .slice(pageIndex * tiersPerPage, (pageIndex + 1) * tiersPerPage)
                  .map(level => {
                    const isUnlocked = unlockedTiers.includes(level.tier);
                    const isCurrentTier = currentTier?.tier === level.tier;
                    const isMilestoneTier = [10, 15, 20, 25].includes(level.tier);
                    
                    return (
                      <div 
                        key={level.tier} 
                        className={`${styles.rewardCard} ${isUnlocked ? styles.unlocked : styles.locked} ${isCurrentTier ? styles.currentTier : ''} ${isMilestoneTier ? styles.milestone : ''}`}
                      >
                        <div className={styles.rewardHeader}>
                          <span className={styles.tierIndicator}>Tier {level.tier}</span>
                          {isMilestoneTier && <span className={styles.milestoneBadge}>⭐</span>}
                        </div>
                        
                        <img src={level.imageUrl} alt={level.name} className={styles.rewardImage} />
                        
                        <div className={styles.rewardInfo}>
                          <h3 className={styles.rewardName}>{level.name}</h3>
                          <p className={styles.rewardDesc}>{level.description}</p>
                          <div className={styles.rewardMeta}>
                            <span className={styles.rewardType}>{level.type}</span>
                            <span className={styles.rewardReq}>{level.kmRequired} km</span>
                          </div>
                        </div>
                        
                        <div className={styles.rewardStatus}>
                          {isUnlocked ? (
                            <span className={styles.unlockedText}>✓ Unlocked</span>
                          ) : (
                            <span className={styles.lockedText}>Locked</span>
                          )}
                          {isCurrentTier && <span className={styles.currentBadge}>Current</span>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tierProgress}>
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>Overall Progress</span>
            <span className={styles.progressText}>
              {unlockedTiers.length} of {battlepassTiers.length} Tiers
            </span>
          </div>
          <div className={styles.progressBarContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${(unlockedTiers.length / battlepassTiers.length) * 100}%` }}
            />
          </div>
          <span className={styles.progressPercentage}>
            {Math.round((unlockedTiers.length / battlepassTiers.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default BattlePass;