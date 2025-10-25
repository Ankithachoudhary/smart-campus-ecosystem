import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';

const ResolveFeedback = ({ onUpdate }) => {
  const { addNotification } = useNotification();
  const [feedback, setFeedback] = useState([]);
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    loadFeedback();
  }, []);

  useEffect(() => {
    if (onUpdate) onUpdate();
  }, [feedback]);

  const loadFeedback = () => {
    const allFeedback = JSON.parse(localStorage.getItem('campusFeedback') || '[]');
    setFeedback(allFeedback);
  };

  const handleResolve = (feedbackId) => {
    const updated = feedback.map(fb =>
      fb.id === feedbackId ? { ...fb, status: 'resolved' } : fb
    );
    setFeedback(updated);
    localStorage.setItem('campusFeedback', JSON.stringify(updated));
    addNotification('Feedback Resolved', 'The feedback has been marked as resolved', 'success');
  };

  const filteredFeedback = feedback.filter(fb =>
    filterStatus === 'all' ? true : fb.status === filterStatus
  );

  return (
    <div className="resolve-feedback-section">
      <div className="section-header">
        <h2>Resolve Feedback</h2>
      </div>

      <div className="filter-bar">
        <select
          className="form-control"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Feedback</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {filteredFeedback.length === 0 ? (
        <div className="empty-state">
          <p>No feedback to display</p>
        </div>
      ) : (
        <div className="feedback-list">
          {filteredFeedback.map(item => (
            <div key={item.id} className="feedback-item">
              <div className="feedback-header">
                <div>
                  <h4>{item.subject}</h4>
                  <p className="feedback-meta">
                    {item.type} • {item.category}
                  </p>
                </div>
                <span className={`status-badge status-${item.status}`}>
                  {item.status}
                </span>
              </div>
              <p className="feedback-message">{item.message}</p>
              <div className="feedback-footer">
                <span>👤 {item.submittedBy}</span>
                <span>📅 {new Date(item.date).toLocaleDateString()}</span>
              </div>
              {item.status === 'pending' && (
                <div className="feedback-actions">
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={() => handleResolve(item.id)}
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResolveFeedback;
