// src/components/LeaderboardTable.jsx

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
          {data.map((user, index) => (
            <tr key={user.userId} className={getRankClass(index)}>
              <td className={styles.rankCell}>
                <span className={styles.rank}>{index + 1}</span>
              </td>
              {/* --- FIX: Change `user.email` to `user.username` --- */}
              <td className={styles.userCell}>{user.username}</td>
              <td className={styles.statCell}>{formatStat(user[statKey])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderboardTable;