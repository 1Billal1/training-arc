import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile'; 
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";  // Navbar import
import { AuthProvider } from './context/AuthContext'; 
import { ThemeProvider } from './context/ThemeContext'; 
import './App.css'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="app-container">
            {/* Navbar visible on all protected pages */}
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Navbar /> {/* Navbar included */}
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Profile />
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
