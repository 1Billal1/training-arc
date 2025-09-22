// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile'; 
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from './context/AuthContext'; 
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import './App.css'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider> {/* Wrap the app in the ThemeProvider */}
          <div className="app-container">
            <Routes>
              {/* Sign-in page */}
              <Route path="/" element={<SignIn />} />
              
              {/* Sign-up Route */}
              <Route path="/signup" element={<SignUp />} />

              {/* Protected Home */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;