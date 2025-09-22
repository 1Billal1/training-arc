// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard"; // 1. Import Leaderboard
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from './context/AuthContext'; 
import { ThemeProvider } from './context/ThemeContext';
import './App.css'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected Routes */}
              <Route path="/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              {/* 2. Add Leaderboard as a protected route */}
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />

            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;