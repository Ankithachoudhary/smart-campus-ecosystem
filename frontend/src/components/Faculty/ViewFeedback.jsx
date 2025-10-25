import React, { useState, useEffect } from 'react';

const ViewFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadFeedback();
  }, []);

  useEffect(() => {
    filterFeedbackData();
  }, [filterStatus, filterCategory, feedback]);

  const loadFeedback = () => {
    const allFeedback = JSON.parse(localStorage.getItem('campusFeedback') || '[]');
    setFeedback(allFeedback);
  };

  const filterFeedbackData = () => {
    let filtered = feedback;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(fb => fb.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(fb => fb.category === filterCategory);
    }

    setFilteredFeedback(filtered);
  };

  return (
    <div className="view-feedback-section">
      <div className="section-header">
        <h2>Student Feedback</h2>
      </div>

      <div className="filter-bar">
        <select
          className="form-control"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          className="form-control"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="academics">Academics</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="facilities">Facilities</option>
          <option value="administration">Administration</option>
          <option value="other">Other</option>
        </select>
      </div>

      {filteredFeedback.length === 0 ? (
        <div className="empty-state">
          <p>No feedback available</p>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
