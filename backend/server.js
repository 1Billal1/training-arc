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
      await updateUserTrainingScore(userId, totalDistance, totalTimeSeconds);
    }
    
    res.status(201).json({ id: docRef.id, ...runData });
  } catch (error) {
    console.error("Error creating run:", error);
    res.status(500).send('Failed to create run.');
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const snapshot = await db.collection('users')
      .where('trainingScore', '>=', 0)
      .orderBy('trainingScore', 'desc')
      .limit(100)
      .get();
      
    const leaderboard = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            uid: data.uid,
            email: data.email,
            trainingScore: data.trainingScore
        }
    });
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).send('Failed to fetch leaderboard.');
  }
});


// --- Training Score Calculation Logic (CORRECTED) ---
async function updateUserTrainingScore(userId, distanceKm, timeSeconds) {
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    console.log(`User ${userId} not found for score update.`);
    return;
  }
  
  const GOAL_PACE_SECONDS_PER_KM = (60 * 60) / 11;

  const userPaceSecondsPerKm = timeSeconds / distanceKm;
  
  // --- CORRECTION 1: Read 'trainingScore' and default to 1000 ---
  const currentScore = userDoc.data().trainingScore || 1000;
  
  let result;
  if (userPaceSecondsPerKm < GOAL_PACE_SECONDS_PER_KM) {
    result = 1;
  } else {
    result = 0;
  }

  const opponentRating = 1000;
  const distanceModifier = Math.min(distanceKm / 11, 1.0);
  const K_FACTOR = Math.round(50 * distanceModifier);

  const { playerRating: newScore } = calculate(currentScore, opponentRating, result, K_FACTOR);

  // --- CORRECTION 2: Write to 'trainingScore', not 'elo' ---
  await userRef.set({
    trainingScore: Math.max(500, Math.round(newScore))
  }, { merge: true });
}


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});