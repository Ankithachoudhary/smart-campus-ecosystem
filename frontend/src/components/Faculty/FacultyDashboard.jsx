import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import CreateEvent from './CreateEvent';
import ManageEvents from './ManageEvents';
import ViewFeedback from './ViewFeedback';
import StatsCard from '../Shared/StatsCard';

const FacultyDashboard = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    eventsCreated: 0,
    totalAttendees: 0,
    feedbackReceived: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    loadFacultyStats();
  }, []);

  const loadFacultyStats = () => {
    const events = JSON.parse(localStorage.getItem('campusEvents') || '[]');
    const feedback = JSON.parse(localStorage.getItem('campusFeedback') || '[]');

    const facultyEvents = events.filter(e => e.createdBy === currentUser.name);
    const upcomingEvents = facultyEvents.filter(e => new Date(e.date) >= new Date());
    const totalAttendees = facultyEvents.reduce((sum, e) => sum + (e.attendees?.length || 0), 0);

    setStats({
      eventsCreated: facultyEvents.length,
      totalAttendees,
      feedbackReceived: feedback.length,
      upcomingEvents: upcomingEvents.length
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'create-event':
        return <CreateEvent onEventCreated={() => { loadFacultyStats(); setActiveTab('manage-events'); }} />;
      case 'manage-events':
        return <ManageEvents />;
      case 'feedback':
        return <ViewFeedback />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <>
      <div className="section-header">
        <div>
          <h2>Faculty Dashboard</h2>
          <p>Welcome, {currentUser?.name}! 👨‍🏫</p>
          {currentUser?.department && (
            <p className="user-details">Department: {currentUser.department}</p>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard 
          icon="📅" 
          value={stats.eventsCreated} 
          label="Events Created"
          color="blue"
        />
        <StatsCard 
          icon="📢" 
          value={stats.upcomingEvents} 
          label="Upcoming Events"
          color="green"
        />
        <StatsCard 
          icon="👥" 
          value={stats.totalAttendees} 
          label="Total Attendees"
          color="purple"
        />
        <StatsCard 
          icon="💬" 
          value={stats.feedbackReceived} 
          label="Feedback Items"
          color="orange"
        />
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <div className="action-card" onClick={() => setActiveTab('create-event')}>
            <div className="action-icon">➕</div>
            <h4>Create Event</h4>
            <p>Organize a new campus event</p>
          </div>
          <div className="action-card" onClick={() => setActiveTab('manage-events')}>
            <div className="action-icon">📝</div>
            <h4>Manage Events</h4>
            <p>Edit or delete your events</p>
          </div>
          <div className="action-card" onClick={() => setActiveTab('feedback')}>
            <div className="action-icon">📊</div>
            <h4>View Feedback</h4>
            <p>Review student feedback</p>
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
          className={`tab-btn ${activeTab === 'create-event' ? 'active' : ''}`}
          onClick={() => setActiveTab('create-event')}
        >
          Create Event
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manage-events' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage-events')}
        >
          Manage Events
        </button>
        <button 
          className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          Feedback
        </button>
      </div>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default FacultyDashboard;
