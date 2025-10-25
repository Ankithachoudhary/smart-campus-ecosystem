import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import EventCard from '../Shared/EventCard';

const ViewEvents = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, filterType, events]);

  const loadEvents = () => {
    const saved = localStorage.getItem('campusEvents');
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      // Initialize with sample events
      initializeSampleEvents();
    }
  };

  const initializeSampleEvents = () => {
    const today = new Date();
    const sampleEvents = [
      {
        id: 1,
        title: 'Tech Fest 2025',
        description: 'Annual technical festival featuring hackathons, workshops, and tech talks.',
        date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T'),
        time: '09:00',
        location: 'Main Auditorium',
        organizer: 'Technical Club',
        category: 'technical',
        createdBy: 'Faculty',
        attendees: []
      },
      {
        id: 2,
        title: 'Cultural Night',
        description: 'Showcase your talents in music, dance, and drama.',
        date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T'),
        time: '18:00',
        location: 'Open Air Theatre',
        organizer: 'Cultural Committee',
        category: 'cultural',
        createdBy: 'Faculty',
        attendees: []
      },
      {
        id: 3,
        title: 'Sports Day',
        description: 'Inter-department sports competition.',
        date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T'),
        time: '07:00',
        location: 'Sports Complex',
        organizer: 'Sports Committee',
        category: 'sports',
        createdBy: 'Admin',
        attendees: []
      }
    ];
    setEvents(sampleEvents);
    localStorage.setItem('campusEvents', JSON.stringify(sampleEvents));
  };

  const loadRegistrations = () => {
    const saved = localStorage.getItem(`eventRegistrations_${currentUser.email}`);
    if (saved) {
      setRegisteredEvents(JSON.parse(saved));
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filterType === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.date) >= today);
    } else if (filterType === 'past') {
      filtered = filtered.filter(event => new Date(event.date) < today);
    } else if (filterType === 'registered') {
      filtered = filtered.filter(event => registeredEvents.includes(event.id));
    }

    setFilteredEvents(filtered);
  };

  const handleRegister = (eventId) => {
    const event = events.find(e => e.id === eventId);
    
    if (registeredEvents.includes(eventId)) {
      addNotification(
        'Already Registered',
        `You are already registered for "${event.title}"`,
        'info'
      );
      return;
    }

    const updated = [...registeredEvents, eventId];
    setRegisteredEvents(updated);
    localStorage.setItem(`eventRegistrations_${currentUser.email}`, JSON.stringify(updated));

    // Update event attendees
    event.attendees = event.attendees || [];
    event.attendees.push(currentUser.email);
    
    const updatedEvents = events.map(e => e.id === eventId ? event : e);
    setEvents(updatedEvents);
    localStorage.setItem('campusEvents', JSON.stringify(updatedEvents));

    addNotification(
      'Registration Successful',
      `You have been registered for "${event.title}"`,
      'success'
    );
  };

  return (
    <div className="events-section">
      <div className="section-header">
        <h2>Campus Events</h2>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-control"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="registered">My Registrations</option>
        </select>
      </div>

      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <p className="empty-state">No events found</p>
        ) : (
          filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={handleRegister}
              isRegistered={registeredEvents.includes(event.id)}
              showActions={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ViewEvents;
