const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Import your service account key
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
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

