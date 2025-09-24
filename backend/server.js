// backend/server.js

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path'); // <-- 1. IMPORT THE 'path' MODULE
require('dotenv').config();

// Check if the environment variable is set
if (!process.env.FIREBASE_CREDENTIALS_JSON) {
  // This error will crash the server on startup if the variable is missing,
  // which is good because it prevents the app from running in a broken state.
  throw new Error('The FIREBASE_CREDENTIALS_JSON environment variable is not set.');
}

// 1. Parse the credentials from the environment variable string
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);

// 2. Initialize the Firebase Admin SDK with the parsed credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
// Render sets the PORT environment variable for you.
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- 2. SERVE STATIC FILES FROM THE REACT BUILD FOLDER ---
// This tells Express to look for files in the 'dist' folder of your frontend.
// The path.join function creates a correct file path regardless of the operating system.
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const db = admin.firestore();

// --- Your API Routes Go Here ---
app.get('/', (req, res) => {
  res.send('Hello from the running tracker backend!');
});

app.get('/api/test', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Example additional API route:
app.get('/api/test2', (req, res) => {
  res.json({ message: 'API is working' });
});

// --- 3. THE "CATCH-ALL" HANDLER ---
// This route handler must be the LAST one.
// It sends back the main index.html file for any request that doesn't match one of the API routes above.
// This is essential for single-page applications like React, allowing React Router to handle the URL.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});