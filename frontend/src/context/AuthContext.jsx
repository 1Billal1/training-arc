// src/context/AuthContext.jsx

import React, { useContext, useState, useEffect, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase'; // <-- Import db
// Import Firestore functions
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      // --- NEW: User Profile Syncing Logic ---
      if (user) {
        // Check if the user has a document in our "users" collection
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        // If the document does NOT exist, create it.
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            // Use the auth display name if it exists, otherwise default to the email part
            username: user.displayName || user.email.split('@')[0],
            createdAt: serverTimestamp(),
            totalDistance: 0,
            unlockedTiers: [],
            equippedBadge: null, 
            equippedBanner: null,
          });
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}