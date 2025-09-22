// backend/server.js

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { calculate } = require('elo-rating');

// --- Firebase Admin Initialization ---
if (!process.env.FIREBASE_CREDENTIALS_JSON) {
  throw new Error('The FIREBASE_CREDENTIALS_JSON environment variable is not set.');
}
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = admin.firestore();

// --- API Endpoints ---

app.get('/', (req, res) => {
  res.send('Hello from the running tracker backend!');
});

app.post('/api/runs', async (req, res) => {
  try {
    const { userId, totalDistance, numLaps, lapTimes, totalTimeSeconds, runDate, isRanked } = req.body;

    if (!userId || !totalDistance || !runDate) {
      return res.status(400).send('Missing required run data.');
    }

    const runData = {
      userId,
      totalDistance: parseFloat(totalDistance),
      numLaps,
      lapTimes,
      totalTimeSeconds,
      runDate: admin.firestore.Timestamp.fromDate(new Date(runDate)),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('runs').add(runData);

    if (isRanked) {
      // --- UPDATED: Call the new training score function ---
      await updateUserTrainingScore(userId, totalDistance, totalTimeSeconds);
    }
    
    res.status(201).json({ id: docRef.id, ...runData });
  } catch (error) {
    console.error("Error creating run:", error);
    res.status(500).send('Failed to create run.');
  }
});

// --- UPDATED: Leaderboard now fetches 'trainingScore' ---
app.get('/api/leaderboard', async (req, res) => {
  try {
    const snapshot = await db.collection('users')
      .where('trainingScore', '>=', 0) // Query for users with a score
      .orderBy('trainingScore', 'desc')
      .limit(100)
      .get();
      
    const leaderboard = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            uid: data.uid,
            email: data.email,
            // --- UPDATED: Use trainingScore instead of elo ---
            trainingScore: data.trainingScore 
        }
    });
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).send('Failed to fetch leaderboard.');
  }
});


// --- NEW: Training Score Calculation Logic ---
async function updateUserTrainingScore(userId, distanceKm, timeSeconds) {
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    console.log(`User ${userId} not found for score update.`);
    return;
  }
  
  // --- Define Training Parameters ---
  // Our goal pace for an 11km run in 60 minutes is ~327 seconds per km.
  const GOAL_PACE_SECONDS_PER_KM = (60 * 60) / 11; // 327.27 seconds/km

  // User's performance in this run
  const userPaceSecondsPerKm = timeSeconds / distanceKm;
  
  // Provide a default score if the field is missing. Starting score is 1000.
  const currentScore = userDoc.data().trainingScore || 1000;
  
  let result; // 1 for beating the goal pace, 0 for missing it
  if (userPaceSecondsPerKm < GOAL_PACE_SECONDS_PER_KM) {
    result = 1; // "Win" - Faster than goal pace
  } else {
    result = 0; // "Loss" - Slower than or equal to goal pace
  }

  // --- Calculate Score Change ---
  // The "opponent" is the goal pace, which we can represent with a static rating.
  const opponentRating = 1000;
  // K-Factor determines the max score change. We'll make it dependent on run distance.
  // A full 11km run has the max impact. A short run has very little.
  const distanceModifier = Math.min(distanceKm / 11, 1.0); // Capped at 1.0 for runs > 11km
  const K_FACTOR = Math.round(50 * distanceModifier); // Max score change is 50 points

  const { playerRating: newScore } = calculate(currentScore, opponentRating, result, K_FACTOR);

  // Update the user's score in Firestore, with a floor of 500
  await userRef.set({
    trainingScore: Math.max(500, Math.round(newScore))
  }, { merge: true });
}


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});