import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import ItemCard from '../Shared/ItemCard';

const ReportLostItem = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'electronics',
    description: '',
    location: '',
    status: 'lost'
  });

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, categoryFilter, statusFilter, items]);

  const loadItems = () => {
    const saved = localStorage.getItem('lostItems');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      initializeSampleItems();
    }
  };

  const initializeSampleItems = () => {
    const sampleItems = [
      {
        id: 1,
        name: 'Black Backpack',
        category: 'accessories',
        description: 'Black Nike backpack with laptop compartment',
        location: 'Library - 2nd Floor',
        status: 'lost',
        reportedBy: 'John Doe',
        reportedByEmail: 'john@klh.edu.in',
        reportedDate: new Date().toISOString()
      },
      {
        id: 2,
        name: 'iPhone 13',
        category: 'electronics',
        description: 'Blue iPhone 13 with cracked screen protector',
        location: 'Cafeteria',
        status: 'found',
        reportedBy: 'Jane Smith',
        reportedByEmail: 'jane@klh.edu.in',
        reportedDate: new Date().toISOString()
      }
    ];
    setItems(sampleItems);
    localStorage.setItem('lostItems', JSON.stringify(sampleItems));
  };

  const filterItems = () => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredItems(filtered);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      id: Date.now(),
      ...formData,
      reportedBy: currentUser.name,
      reportedByEmail: currentUser.email,
      reportedDate: new Date().toISOString()
    };

    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem('lostItems', JSON.stringify(updated));

    addNotification(
      'Item Reported',
      `${formData.status === 'lost' ? 'Lost' : 'Found'} item "${formData.name}" has been reported successfully`,
      'success'
    );

    setShowModal(false);
    setFormData({
      name: '',
      category: 'electronics',
      description: '',
      location: '',
      status: 'lost'
    });
  };

  const handleContact = (item) => {
    addNotification(
      'Contact Information',
      `Reporter: ${item.reportedBy}\nEmail: ${item.reportedByEmail}`,
      'info'
    );
  };

  return (
    <div className="lost-found-section">
      <div className="section-header">
        <h2>Lost & Found</h2>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          Report Item
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-control"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="id-cards">ID Cards</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>
        <select
          className="form-control"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>

      <div className="items-grid">
        {filteredItems.length === 0 ? (
          <p className="empty-state">No items found</p>
        ) : (
          filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onContact={handleContact}
            />
          ))
        )}
      </div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Report Lost/Found Item</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Item Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
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
                  <option value="electronics">Electronics</option>
                  <option value="books">Books</option>
                  <option value="id-cards">ID Cards</option>
                  <option value="accessories">Accessories</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Last Seen Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportLostItem;
