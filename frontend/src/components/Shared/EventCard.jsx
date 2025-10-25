import React from 'react';

const EventCard = ({ event, onRegister, isRegistered, showActions = true }) => {
  const eventDate = new Date(event.date);
  const today = new Date();
  const isPast = eventDate < today;

  return (
    <div className="event-card">
      <div className="event-banner">
        <span className="event-icon">📅</span>
      </div>
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>
        <div className="event-details">
          <div className="event-detail-item">
            <span>📅</span>
            <span>{eventDate.toLocaleDateString()}</span>
          </div>
          <div className="event-detail-item">
            <span>🕐</span>
            <span>{event.time}</span>
          </div>
          <div className="event-detail-item">
            <span>📍</span>
            <span>{event.location}</span>
          </div>
          <div className="event-detail-item">
            <span>👤</span>
            <span>{event.organizer}</span>
          </div>
        </div>
        {showActions && !isPast && (
          <div className="event-actions">
            {isRegistered ? (
              <button className="btn btn--secondary btn--sm" disabled>
                ✓ Registered
              </button>
            ) : (
              <button 
                className="btn btn--primary btn--sm"
                onClick={() => onRegister(event.id)}
              >
                Register Now
              </button>
            )}
          </div>
        )}
        {isPast && (
          <div className="event-badge event-badge--past">
            Event Ended
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
