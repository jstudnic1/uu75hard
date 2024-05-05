import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Login';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
