import React from 'react';

const ItemCard = ({ item, onContact }) => {
  return (
    <div className="item-card">
      <div className="item-header">
        <h4 className="item-title">{item.name}</h4>
        <span className={`item-status item-status--${item.status}`}>
          {item.status}
        </span>
      </div>
      <p className="item-description">{item.description}</p>
      <div className="item-meta">
        <div className="item-meta-row">
          <span>🏷️ Category:</span>
          <span>{item.category}</span>
        </div>
        <div className="item-meta-row">
          <span>📍 Location:</span>
          <span>{item.location}</span>
        </div>
        <div className="item-meta-row">
          <span>👤 Reported by:</span>
          <span>{item.reportedBy}</span>
        </div>
        <div className="item-meta-row">
          <span>📅 Date:</span>
          <span>{new Date(item.reportedDate).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="item-actions">
        <button 
          className="btn btn--primary btn--sm"
          onClick={() => onContact(item)}
        >
          Contact Reporter
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
