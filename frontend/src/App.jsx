// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile'; 
import BattlePass from './pages/BattlePass';
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout"; // <-- Import your new Layout component
import { AuthProvider } from './context/AuthContext'; 
import { ThemeProvider } from './context/ThemeContext'; 
import './App.css'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          {/* The app-container div is often better placed inside the Layout or handled by App.css */}
          <Routes>
            {/* Public routes have no shared layout */}
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* --- This is the new, correct structure for protected routes --- */}
            <Route 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* All the routes nested inside here will render within the Layout */}
              {/* This means they will all automatically have a Navbar */}
              <Route path="/home" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/battlepass" element={<BattlePass />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;