import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Authentication Components
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';

// Dashboard Components
import StudentDashboard from './components/Student/StudentDashboard';
import FacultyDashboard from './components/Faculty/FacultyDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

// Shared Components
import Navbar from './components/Shared/Navbar';
import Notifications from './components/Shared/Notifications';
import Chatbot from './components/Shared/Chatbot';

// Styles
import './styles/App.css';
import './styles/Auth.css';
import './styles/Dashboard.css';
import './styles/Components.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showAuth, setShowAuth] = useState('login');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      setIsAuthenticated(true);
      setUserRole(userData.role);
    }
  }, []);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (!isAuthenticated) {
    return (
      <AuthProvider>
        <div className="auth-container">
          {showAuth === 'login' ? (
            <Login 
              onLogin={handleLogin} 
              onSwitchToSignup={() => setShowAuth('signup')} 
            />
          ) : (
            <Signup 
              onSignup={handleLogin} 
              onSwitchToLogin={() => setShowAuth('login')} 
            />
          )}
        </div>
      </AuthProvider>
    );
  }

  const getDashboardComponent = () => {
    switch (userRole) {
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="app">
            <Navbar onLogout={handleLogout} userRole={userRole} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={getDashboardComponent()} />
                <Route path="/dashboard" element={getDashboardComponent()} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
            <Notifications />
            <Chatbot />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
