import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Login';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import ManageHabitsPage from './ManageHabitsPage'; // Make sure this import is correct
import QuotesPage from './QuotesPage'; // Import the QuotesPage component
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/manage-habits" element={<ManageHabitsPage />} />
          <Route path="/quotes" element={<QuotesPage />} />  // Add this line
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
