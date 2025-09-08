// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from "./pages/signin";
import Dashboard from "./pages/Dashboard";
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile'; 
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout'; 
import './App.css'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<SignIn />} />

          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;