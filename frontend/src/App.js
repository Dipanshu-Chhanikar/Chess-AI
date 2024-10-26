import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChessGame from './components/Chessboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for a stored token
    setIsAuthenticated(!!token); // Set to true if token exists
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Route */}
          <Route
            path="/chess"
            element={
              isAuthenticated ? <ChessGame /> : <Navigate to="/login" replace />
            }
          />

          {/* Redirect any unmatched routes */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/chess" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
