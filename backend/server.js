const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path'); // <-- 1. IMPORT THE 'path' MODULE
require('dotenv').config();


// --- Firebase Admin SDK Initialization ---
if (!process.env.FIREBASE_CREDENTIALS_JSON) {
  throw new Error('The FIREBASE_CREDENTIALS_JSON environment variable is not set.');
}
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// --- 2. SERVE STATIC FILES FROM THE REACT BUILD FOLDER ---
// This is the new middleware that tells Express where to find your built React app.
// It will serve files like index.html, your CSS, and your images from the 'public' folder.
app.use(express.static(path.join(__dirname, '../frontend/dist')));


// --- Your API Routes Go Here ---
// Keep all your existing and future API routes in this section.
app.get('/api/test', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// (Add other API routes like app.post('/api/admin/...') here)


// --- 3. THE "CATCH-ALL" HANDLER ---
// This must be the LAST route handler.
// It ensures that any request that doesn't match an API route above will be
// sent the main index.html file. This allows React Router to take over and
// handle all the client-side navigation (e.g., to /dashboard, /profile, etc.).
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});