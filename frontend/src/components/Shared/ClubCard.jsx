import React from 'react';

const ClubCard = ({ club, isJoined, onJoin, onLeave }) => {
  return (
    <div className="club-card">
      <div className="club-icon">{club.icon}</div>
      <h3 className="club-name">{club.name}</h3>
      <span className="club-category">{club.category}</span>
      <p className="club-description">{club.description}</p>
      <div className="club-meta">
        <div className="club-meta-item">
          <span>👥 {club.members} members</span>
        </div>
        <div className="club-meta-item">
          <span>👤 {club.coordinator}</span>
        </div>
      </div>
      <div className="club-schedule">
        📅 {club.meetingSchedule}
      </div>
      <div className="club-actions">
        {isJoined ? (
          <button 
            className="btn btn--outline btn--sm btn--full-width"
            onClick={() => onLeave(club.id)}
          >
            Leave Club
          </button>
        ) : (
          <button 
            className="btn btn--primary btn--sm btn--full-width"
            onClick={() => onJoin(club.id)}
          >
            Join Club
          </button>
        )}
      </div>
    </div>
  );
};

export default ClubCard;
