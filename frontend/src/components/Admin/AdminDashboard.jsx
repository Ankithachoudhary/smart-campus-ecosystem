import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../Shared/StatsCard';
import ManageUsers from './ManageUsers';
import ManageAllEvents from './ManageAllEvents';
import ResolveFeedback from './ResolveFeedback';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalFeedback: 0,
    pendingFeedback: 0
  });

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = () => {
    const users = JSON.parse(localStorage.getItem('campusUsers') || '[]');
    const events = JSON.parse(localStorage.getItem('campusEvents') || '[]');
    const feedback = JSON.parse(localStorage.getItem('campusFeedback') || '[]');

    setStats({
      totalUsers: users.length,
      totalEvents: events.length,
      totalFeedback: feedback.length,
      pendingFeedback: feedback.filter(fb => fb.status === 'pending').length
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return <ManageUsers />;
      case 'events':
        return <ManageAllEvents />;
      case 'feedback':
        return <ResolveFeedback onUpdate={loadAdminStats} />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <>
      <div className="section-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Welcome, {currentUser?.name}! 👨‍💼</p>
          <p className="user-details">System Administrator</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard 
          icon="👥" 
          value={stats.totalUsers} 
          label="Total Users"
          color="blue"
        />
        <StatsCard 
          icon="📅" 
          value={stats.totalEvents} 
          label="Total Events"
          color="green"
        />
        <StatsCard 
          icon="💬" 
          value={stats.totalFeedback} 
          label="Total Feedback"
          color="purple"
        />
        <StatsCard 
          icon="⚠️" 
          value={stats.pendingFeedback} 
          label="Pending Feedback"
          color="orange"
        />
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <div className="action-card" onClick={() => setActiveTab('users')}>
            <div className="action-icon">👥</div>
            <h4>Manage Users</h4>
            <p>View and manage all registered users</p>
          </div>
          <div className="action-card" onClick={() => setActiveTab('events')}>
            <div className="action-icon">📅</div>
            <h4>Manage Events</h4>
            <p>Oversee all campus events</p>
          </div>
          <div className="action-card" onClick={() => setActiveTab('feedback')}>
            <div className="action-icon">✅</div>
            <h4>Resolve Feedback</h4>
            <p>Review and resolve student feedback</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Manage Events
        </button>
        <button 
          className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          Resolve Feedback
        </button>
      </div>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
