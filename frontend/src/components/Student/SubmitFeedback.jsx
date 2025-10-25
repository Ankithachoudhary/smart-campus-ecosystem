import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const SubmitFeedback = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [myFeedback, setMyFeedback] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'general',
    category: 'academics',
    subject: '',
    message: '',
    anonymous: false
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });

  useEffect(() => {
    loadMyFeedback();
  }, []);

  const loadMyFeedback = () => {
    const allFeedback = JSON.parse(localStorage.getItem('campusFeedback') || '[]');
    const userFeedback = allFeedback.filter(
      fb => fb.submittedBy === currentUser.name || fb.submittedByEmail === currentUser.email
    );

    setMyFeedback(userFeedback);

    setStats({
      total: userFeedback.length,
      pending: userFeedback.filter(fb => fb.status === 'pending').length,
      resolved: userFeedback.filter(fb => fb.status === 'resolved').length
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFeedback = {
      id: Date.now(),
      ...formData,
      submittedBy: formData.anonymous ? 'Anonymous' : currentUser.name,
      submittedByEmail: currentUser.email,
      status: 'pending',
      date: new Date().toISOString()
    };

    const allFeedback = JSON.parse(localStorage.getItem('campusFeedback') || '[]');
    const updated = [newFeedback, ...allFeedback];
    localStorage.setItem('campusFeedback', JSON.stringify(updated));

    addNotification(
      'Feedback Submitted',
      'Your feedback has been submitted successfully and will be reviewed by the administration',
      'success'
    );

    setShowModal(false);
    setFormData({
      type: 'general',
      category: 'academics',
      subject: '',
      message: '',
      anonymous: false
    });

    loadMyFeedback();
  };

  return (
    <div className="feedback-section">
      <div className="section-header">
        <h2>Feedback & Grievances</h2>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          Submit New Feedback
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <h4>{stats.total}</h4>
          <p>Total Submissions</p>
        </div>
        <div className="stat-box">
          <h4>{stats.pending}</h4>
          <p>Pending</p>
        </div>
        <div className="stat-box">
          <h4>{stats.resolved}</h4>
          <p>Resolved</p>
        </div>
      </div>

      <div className="feedback-list">
        {myFeedback.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any feedback yet</p>
            <button className="btn btn--primary" onClick={() => setShowModal(true)}>
              Submit Your First Feedback
            </button>
          </div>
        ) : (
          myFeedback.map(feedback => (
            <div key={feedback.id} className="feedback-item">
              <div className="feedback-header">
                <div>
                  <h4>{feedback.subject}</h4>
                  <p className="feedback-meta">
                    {feedback.type} • {feedback.category}
                  </p>
                </div>
                <span className={`status-badge status-${feedback.status}`}>
                  {feedback.status}
                </span>
              </div>
              <p className="feedback-message">{feedback.message}</p>
              <div className="feedback-footer">
                <span>📅 {new Date(feedback.date).toLocaleDateString()}</span>
                {feedback.anonymous && <span>🔒 Anonymous</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Submit Feedback</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  className="form-control"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="general">General Feedback</option>
                  <option value="grievance">Grievance</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="complaint">Complaint</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="academics">Academics</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="facilities">Facilities</option>
                  <option value="administration">Administration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="form-control"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief subject of your feedback"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Provide detailed feedback or describe your grievance"
                  required
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleInputChange}
                  />
                  Submit Anonymously
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitFeedback;
