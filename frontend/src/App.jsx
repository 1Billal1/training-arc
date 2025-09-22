// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from './context/AuthContext'; 
import './App.css'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            {/* Sign-in page */}
            <Route path="/" element={<SignIn />} />
            
            {/* 2. ADD THE SIGN-UP ROUTE */}
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
      </AuthProvider>
    </Router>
  );
}

export default App;
