import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import ClubCard from '../Shared/ClubCard';

const JoinClubs = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [joinedClubs, setJoinedClubs] = useState([]);

  useEffect(() => {
    loadClubs();
    loadJoinedClubs();
  }, []);

  useEffect(() => {
    filterClubs();
  }, [searchTerm, categoryFilter, clubs]);

  const loadClubs = () => {
    const saved = localStorage.getItem('campusClubs');
    if (saved) {
      setClubs(JSON.parse(saved));
    } else {
      initializeSampleClubs();
    }
  };

  const initializeSampleClubs = () => {
    const sampleClubs = [
      {
        id: 1,
        name: 'Coding Club',
        icon: '💻',
        category: 'technical',
        description: 'Learn programming, participate in hackathons, and build amazing projects together.',
        members: 156,
        coordinator: 'Dr. Smith',
        meetingSchedule: 'Every Friday, 4 PM'
      },
      {
        id: 2,
        name: 'Music Club',
        icon: '🎵',
        category: 'cultural',
        description: 'Express yourself through music. Regular jam sessions and performances.',
        members: 89,
        coordinator: 'Prof. Johnson',
        meetingSchedule: 'Every Wednesday, 5 PM'
      },
      {
        id: 3,
        name: 'Photography Club',
        icon: '📸',
        category: 'arts',
        description: 'Capture moments, learn photography techniques, and showcase your work.',
        members: 72,
        coordinator: 'Ms. Davis',
        meetingSchedule: 'Every Saturday, 3 PM'
      },
      {
        id: 4,
        name: 'Sports Club',
        icon: '⚽',
        category: 'sports',
        description: 'Stay active and healthy. Inter-college tournaments and fitness activities.',
        members: 134,
        coordinator: 'Coach Williams',
        meetingSchedule: 'Daily, 6 AM'
      },
      {
        id: 5,
        name: 'Drama Club',
        icon: '🎭',
        category: 'cultural',
        description: 'Perform on stage, develop acting skills, and create memorable productions.',
        members: 64,
        coordinator: 'Dr. Brown',
        meetingSchedule: 'Every Thursday, 5 PM'
      },
      {
        id: 6,
        name: 'Robotics Club',
        icon: '🤖',
        category: 'technical',
        description: 'Build robots, compete in competitions, and explore automation and AI.',
        members: 91,
        coordinator: 'Prof. Martinez',
        meetingSchedule: 'Every Tuesday, 4 PM'
      },
      {
        id: 7,
        name: 'Social Service Club',
        icon: '🤝',
        category: 'social',
        description: 'Make a difference in the community through various outreach programs.',
        members: 78,
        coordinator: 'Ms. Anderson',
        meetingSchedule: 'Every Sunday, 10 AM'
      },
      {
        id: 8,
        name: 'Dance Club',
        icon: '💃',
        category: 'cultural',
        description: 'Learn different dance forms and perform at campus events and competitions.',
        members: 102,
        coordinator: 'Ms. Taylor',
        meetingSchedule: 'Every Monday & Friday, 6 PM'
      }
    ];
    setClubs(sampleClubs);
    localStorage.setItem('campusClubs', JSON.stringify(sampleClubs));
  };

  const loadJoinedClubs = () => {
    const saved = localStorage.getItem(`joinedClubs_${currentUser.email}`);
    if (saved) {
      setJoinedClubs(JSON.parse(saved));
    }
  };

  const filterClubs = () => {
    let filtered = clubs;

    if (searchTerm) {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(club => club.category === categoryFilter);
    }

    setFilteredClubs(filtered);
  };

  const handleJoinClub = (clubId) => {
    const club = clubs.find(c => c.id === clubId);
    
    if (joinedClubs.includes(clubId)) {
      addNotification(
        'Already Joined',
        `You are already a member of ${club.name}`,
        'info'
      );
      return;
    }

    const updated = [...joinedClubs, clubId];
    setJoinedClubs(updated);
    localStorage.setItem(`joinedClubs_${currentUser.email}`, JSON.stringify(updated));

    // Update club member count
    club.members += 1;
    const updatedClubs = clubs.map(c => c.id === clubId ? club : c);
    setClubs(updatedClubs);
    localStorage.setItem('campusClubs', JSON.stringify(updatedClubs));

    addNotification(
      'Successfully Joined',
      `You are now a member of ${club.name}!`,
      'success'
    );
  };

  const handleLeaveClub = (clubId) => {
    const club = clubs.find(c => c.id === clubId);
    const updated = joinedClubs.filter(id => id !== clubId);
    setJoinedClubs(updated);
    localStorage.setItem(`joinedClubs_${currentUser.email}`, JSON.stringify(updated));

    // Update club member count
    club.members -= 1;
    const updatedClubs = clubs.map(c => c.id === clubId ? club : c);
    setClubs(updatedClubs);
    localStorage.setItem('campusClubs', JSON.stringify(updatedClubs));

    addNotification(
      'Left Club',
      `You have left ${club.name}`,
      'info'
    );
  };

  return (
    <div className="clubs-section">
      <div className="section-header">
        <h2>Student Clubs</h2>
        <p>Explore and join clubs that match your interests</p>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-control"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="technical">Technical</option>
          <option value="cultural">Cultural</option>
          <option value="sports">Sports</option>
          <option value="arts">Arts</option>
          <option value="social">Social Service</option>
        </select>
      </div>

      <div className="clubs-grid">
        {filteredClubs.length === 0 ? (
          <p className="empty-state">No clubs found</p>
        ) : (
          filteredClubs.map(club => (
            <ClubCard
              key={club.id}
              club={club}
              isJoined={joinedClubs.includes(club.id)}
              onJoin={handleJoinClub}
              onLeave={handleLeaveClub}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default JoinClubs;
