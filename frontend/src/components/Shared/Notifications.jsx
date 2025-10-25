import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
      </button>

      {isOpen && (
        <div className="notification-panel active">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              <button className="btn-link" onClick={markAllAsRead}>
                Mark all as read
              </button>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={`notification-icon notification-icon--${notification.type}`}>
                    {notification.type === 'success' && '✓'}
                    {notification.type === 'error' && '✕'}
                    {notification.type === 'info' && 'ℹ'}
                  </div>
                  <div className="notification-content">
                    <h4 className="notification-title">{notification.title}</h4>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;
