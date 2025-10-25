import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Navbar = ({ onLogout, userRole }) => {
  const { currentUser } = useAuth();
  const { unreadCount } = useNotification();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🎓 Smart Campus Hub</h2>
      </div>

      <div className="navbar-menu">
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') || isActive('/')}`}>
          Dashboard
        </Link>
        
       
      </div>

      <div className="navbar-actions">
        <button
          className="btn btn--secondary"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔 
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </button>

        <div className="user-menu">
          <span className="user-name">{currentUser?.name?.split(' ') || 'User'}</span>
          <span className="user-role">{currentUser?.role}</span>
          <button className="btn btn--outline btn--sm" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
