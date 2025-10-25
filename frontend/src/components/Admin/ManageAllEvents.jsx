import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';

const ManageAllEvents = () => {
  const { addNotification } = useNotification();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const allEvents = JSON.parse(localStorage.getItem('campusEvents') || '[]');
    setEvents(allEvents);
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updated = events.filter(e => e.id !== eventId);
      setEvents(updated);
      localStorage.setItem('campusEvents', JSON.stringify(updated));
      addNotification('Event Deleted', 'Event has been removed successfully', 'success');
    }
  };

  return (
    <div className="manage-all-events-section">
      <div className="section-header">
        <h2>Manage All Events</h2>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No events found</p>
        </div>
      ) : (
        <div className="events-list">
          {events.map(event => (
            <div key={event.id} className="event-manage-card">
              <div className="event-manage-header">
                <h3>{event.title}</h3>
                <span className="event-category">{event.category}</span>
              </div>
              <p className="event-manage-desc">{event.description}</p>
              <div className="event-manage-details">
                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                <span>🕐 {event.time}</span>
                <span>📍 {event.location}</span>
                <span>👤 Created by: {event.createdBy}</span>
                <span>👥 {event.attendees?.length || 0} attendees</span>
              </div>
              <div className="event-manage-actions">
                <button className="btn btn--outline btn--sm" onClick={() => handleDelete(event.id)}>
                  Delete Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAllEvents;
