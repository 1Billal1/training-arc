// backend/backfill.js

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
// IMPORTANT: Make sure the path to your config is correct.
// You might need to adjust this path depending on your folder structure.
const { battlepassTiers } = require('../frontend/src/battlepass-config'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function backfillUserProgress() {
  console.log('Starting backfill process...');

  try {
    // 1. Get all documents from the "runs" collection.
    const runsSnapshot = await db.collection('runs').get();
    console.log(`Found ${runsSnapshot.size} total runs to process.`);

    // 2. Aggregate the stats for each user in a temporary object.
    const userStats = {};
    runsSnapshot.forEach(doc => {
      const run = doc.data();
      const { userId, totalDistance } = run;

      // Initialize the user's stats if this is their first run we've seen.
      if (!userStats[userId]) {
        userStats[userId] = {
          totalDistance: 0,
        };
      }
      userStats[userId].totalDistance += totalDistance;
    });

    console.log(`Aggregated stats for ${Object.keys(userStats).length} unique users.`);

    // 3. Loop through each user and update their document in the "users" collection.
    const promises = [];
    for (const userId in userStats) {
      const stats = userStats[userId];
      const userDocRef = db.collection('users').doc(userId);

      // Calculate which tiers this total distance unlocks.
      const unlockedTiers = battlepassTiers
        .filter(level => stats.totalDistance >= level.kmRequired)
        .map(level => level.tier);

      // Prepare the update operation.
      const updatePromise = userDocRef.update({
        totalDistance: stats.totalDistance,
        unlockedTiers: unlockedTiers
      });
      promises.push(updatePromise);

      console.log(`- Prepared update for user ${userId}: Set totalDistance to ${stats.totalDistance.toFixed(2)} km and unlocked ${unlockedTiers.length} tiers.`);
    }

    // 4. Execute all the update operations.
    await Promise.all(promises);

    console.log('\n✅ Backfill successful! All user progress has been updated.');

  } catch (error) {
    console.error('❌ An error occurred during the backfill process:', error);
  }
}

// Run the function
backfillUserProgress();