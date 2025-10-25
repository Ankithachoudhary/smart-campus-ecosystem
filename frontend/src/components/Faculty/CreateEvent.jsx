import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const CreateEvent = ({ onEventCreated }) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    category: 'academic',
    maxAttendees: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: Date.now(),
      ...formData,
      createdBy: currentUser.name,
      createdDate: new Date().toISOString(),
      attendees: []
    };

    const events = JSON.parse(localStorage.getItem('campusEvents') || '[]');
    const updated = [newEvent, ...events];
    localStorage.setItem('campusEvents', JSON.stringify(updated));

    addNotification(
      'Event Created',
      `"${newEvent.title}" has been created successfully and is now visible to all students`,
      'success'
    );

    // Reset form
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      organizer: '',
      category: 'academic',
      maxAttendees: ''
    });

    if (onEventCreated) {
      onEventCreated();
    }
  };

  return (
    <div className="create-event-section">
      <div className="section-header">
        <h2>Create New Event</h2>
        <p>Fill in the details to create a campus event</p>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Event Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Tech Fest 2025"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="academic">Academic</option>
                <option value="technical">Technical</option>
                <option value="cultural">Cultural</option>
                <option value="sports">Sports</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the event"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time *</label>
              <input
                type="time"
                id="time"
                name="time"
                className="form-control"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Main Auditorium"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="organizer">Organizer *</label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                className="form-control"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="e.g., CS Department"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="maxAttendees">Maximum Attendees (Optional)</label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              className="form-control"
              value={formData.maxAttendees}
              onChange={handleChange}
              placeholder="Leave blank for unlimited"
              min="1"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary btn--lg">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
