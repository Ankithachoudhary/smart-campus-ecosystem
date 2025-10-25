import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import ViewEvents from './ViewEvents';
import JoinClubs from './JoinClubs';
import ReportLostItem from './ReportLostItem';
import SubmitFeedback from './SubmitFeedback';
import StatsCard from '../Shared/StatsCard';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    eventsRegistered: 0,
    clubsJoined: 0,
    itemsReported: 0,
    feedbackSubmitted: 0
  });

  useEffect(() => {
    loadStudentStats();
  }, []);

  const loadStudentStats = () => {
    // Load student-specific statistics
    const events = JSON.parse(localStorage.getItem('campusEvents') || '[]');
    const clubs = JSON.parse(localStorage.getItem('myClubs') || '[]');
    const items = JSON.parse(localStorage.getItem('lostItems') || '[]');
    const feedback = JSON.parse(localStorage.getItem('campusFeedback') || '[]');

    const userItems = items.filter(item => item.reportedByEmail === currentUser.email);
    const userFeedback = feedback.filter(fb => fb.submittedBy === currentUser.name);

    setStats({
      eventsRegistered: 0, // Would track from event registrations
      clubsJoined: clubs.length,
      itemsReported: userItems.length,
      feedbackSubmitted: userFeedback.length
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'events':
        return <ViewEvents />;
      case 'clubs':
        return <JoinClubs />;
      case 'lost-found':
        return <ReportLostItem />;
      case 'feedback':
        return <SubmitFeedback />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <>
      <div className="section-header">
        <div>
          <h2>Student Dashboard</h2>
          <p>Welcome back, {currentUser?.name?.split(' ')}! 👋</p>
          {currentUser?.rollNumber && (
            <p className="user-details">Roll No: {currentUser.rollNumber} | Year: {currentUser.year}</p>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard 
          icon="📅" 
          value={stats.eventsRegistered} 
          label="Events Registered"
          color="blue"
        />
        <StatsCard 
          icon="🎯" 
          value={stats.clubsJoined} 
          label="Clubs Joined"
          color="purple"
        />
        <StatsCard 
          icon="🔍" 
          value={stats.itemsReported} 
          label="Items Reported"
          color="orange"
        />
        <StatsCard 
          icon="💬" 
          value={stats.feedbackSubmitted} 
          label="Feedback Submitted"
          color="green"
        />
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <div className="action-card" onClick={() => setActiveTab('events')}>
            <div className="action-icon">📢</div>
            <h4>Browse Events</h4>
            <p>Discover and register for upcoming campus events</p>
          </div>
          <div className="action-card" onClick={() => setActiveTab('clubs')}>
            <div className="action-icon">🎯</div>
            <h4>Join Clubs</h4>
            <p>Explore student organizations and activities</p>
          </div>
          <div className="action-card" onClick={() => setActiveTab('lost-found')}>
            <div className="action-icon">🔍</div>
            <h4>Lost & Found</h4>
            <p>Report or search for lost items</p>
          </div>
          <div className="action-card" onClick={() => setActiveTab('feedback')}>
            <div className="action-icon">📝</div>
            <h4>Give Feedback</h4>
            <p>Share your thoughts and suggestions</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <RecentEventsWidget />
        <RecentAnnouncementsWidget />
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
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button 
          className={`tab-btn ${activeTab === 'clubs' ? 'active' : ''}`}
          onClick={() => setActiveTab('clubs')}
        >
          Clubs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'lost-found' ? 'active' : ''}`}
          onClick={() => setActiveTab('lost-found')}
        >
          Lost & Found
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

// Helper Widgets
const RecentEventsWidget = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const allEvents = JSON.parse(localStorage.getItem('campusEvents') || '[]');
    setEvents(allEvents.slice(0, 5));
  }, []);

  return (
    <div className="card">
      <h3>Upcoming Events</h3>
      <div className="list-container">
        {events.length === 0 ? (
          <p className="empty-state">No upcoming events</p>
        ) : (
          events.map(event => (
            <div key={event.id} className="list-item">
              <div className="list-item-title">{event.title}</div>
              <div className="list-item-meta">
                📅 {new Date(event.date).toLocaleDateString()} • 📍 {event.location}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const RecentAnnouncementsWidget = () => {
  return (
    <div className="card">
      <h3>Recent Announcements</h3>
      <div className="list-container">
        <div className="list-item">
          <div className="list-item-title">📢 Mid-term Examinations</div>
          <div className="list-item-meta">Scheduled from Nov 10-20, 2025</div>
        </div>
        <div className="list-item">
          <div className="list-item-title">🎓 Tech Fest Registration</div>
          <div className="list-item-meta">Register before Nov 5, 2025</div>
        </div>
        <div className="list-item">
          <div className="list-item-title">📚 Library Extended Hours</div>
          <div className="list-item-meta">Open till 10 PM during exams</div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
