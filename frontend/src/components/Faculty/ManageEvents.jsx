import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const ManageEvents = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMyEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, events]);

  const loadMyEvents = () => {
    const allEvents = JSON.parse(localStorage.getItem('campusEvents') || '[]');
    const myEvents = allEvents.filter(e => e.createdBy === currentUser.name);
    setEvents(myEvents);
  };

  const filterEvents = () => {
    if (!searchTerm) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const allEvents = JSON.parse(localStorage.getItem('campusEvents') || '[]');
      const updated = allEvents.filter(e => e.id !== eventId);
      localStorage.setItem('campusEvents', JSON.stringify(updated));
      
      loadMyEvents();
      addNotification('Event Deleted', 'The event has been deleted successfully', 'success');
    }
  };

  return (
    <div className="manage-events-section">
      <div className="section-header">
        <h2>Manage My Events</h2>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search your events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any events yet</p>
        </div>
      ) : (
        <div className="events-list">
          {filteredEvents.map(event => (
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

export default ManageEvents;
