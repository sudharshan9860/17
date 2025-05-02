import React, { useContext } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { NotificationContext } from '../contexts/NotificationContext';

const NotificationDropdown = () => {
  const { 
    notifications = [], 
    markNotificationAsRead, 
    clearAllNotifications,
    getUnreadCount 
  } = useContext(NotificationContext);

  const unreadCount = getUnreadCount();

  const getNotificationIcon = (type) => {
    const iconMap = {
      achievement: '🏆',
      progress: '📈',
      recommendation: '💡',
      reminder: '⏰'
    };
    return iconMap[type] || '🔔';
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="link" id="notifications-dropdown" className="nav-link">
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && (
          <Badge pill bg="danger" className="notification-badge">
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu align="end" className="notification-menu">
        <Dropdown.Header>
          Notifications 
          {unreadCount > 0 && (
            <span 
              className="text-primary ml-2 clear-notifications"
              onClick={clearAllNotifications}
            >
              Clear All
            </span>
          )}
        </Dropdown.Header>
        
        {notifications.length === 0 ? (
          <Dropdown.Item disabled>No notifications</Dropdown.Item>
        ) : (
          notifications.map((notification) => (
            <Dropdown.Item 
              key={notification.id}
              onClick={() => markNotificationAsRead(notification.id)}
              className={!notification.read ? 'unread-notification' : ''}
            >
              <div className="d-flex align-items-center">
                <span className="notification-icon mr-2">
                  {getNotificationIcon(notification.type)}
                </span>
                <div>
                  <strong>{notification.title}</strong>
                  <p className="text-muted mb-0">{notification.message}</p>
                  <small className="text-muted">
                    {new Date(notification.timestamp).toLocaleString()}
                  </small>
                </div>
              </div>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;