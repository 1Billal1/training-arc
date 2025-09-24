import React from 'react';
import styles from './leaderboardTable.module.css';

const getRankClass = (index) => {
  if (index === 0) return styles.gold;
  if (index === 1) return styles.silver;
  if (index === 2) return styles.bronze;
  return '';
};

function LeaderboardTable({ title, data, statKey, formatStat }) {
  return (
    <div className={styles.leaderboardCard}>
      <h3 className={styles.title}>{title}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>{statKey}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => {
            // --- THIS IS THE FIX ---
            // The logic to create and apply the banner style has been removed.
            
            return (
              <tr key={user.userId} className={getRankClass(index)}>
                <td className={styles.rankCell}>
                  <span className={styles.rank}>{index + 1}</span>
                </td>
                
                {/* The `style` prop has been removed from this td */}
                <td 
                  className={styles.userCell} 
                  title={user.username} 
                >
                  {user.equippedBadge && <img src={user.equippedBadge} alt="badge" className={styles.equippedReward} />}
                  <div className={styles.userAndTag}>
                    <span className={styles.username}>{user.username}</span>
                    {user.equippedTagline && (
                      <span className={styles.tagline}>{user.equippedTagline}</span>
                    )}
                  </div>
                </td>
                
                <td className={styles.statCell}>{formatStat(user[statKey])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderboardTable;