const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
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

const db = admin.firestore();

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

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

