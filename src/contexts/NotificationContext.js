import React, { createContext, useState, useEffect } from 'react';
import { NotificationManager } from '../models/Notifications';

export const NotificationContext = createContext({
  notifications: [],
  addAchievementNotification: () => {},
  addProgressNotification: () => {},
  addRecommendationNotification: () => {},
  addReminderNotification: () => {},
  markNotificationAsRead: () => {},
  clearAllNotifications: () => {},
  getUnreadCount: () => 0
});

export const NotificationProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem('username') || 'user');
  const [notificationManager, setNotificationManager] = useState(
    new NotificationManager(username)
  );
  const [notifications, setNotifications] = useState(
    notificationManager.notifications || []
  );

  // Update notifications when the state changes
  const updateNotifications = () => {
    setNotifications([...notificationManager.notifications]);
  };

  // Methods to interact with notifications
  const addAchievementNotification = (achievement) => {
    const notification = notificationManager.addAchievementNotification(achievement);
    updateNotifications();
    return notification;
  };

  const addProgressNotification = (progressType, details) => {
    const notification = notificationManager.addProgressNotification(progressType, details);
    updateNotifications();
    return notification;
  };

  const addRecommendationNotification = (recommendation) => {
    const notification = notificationManager.addRecommendationNotification(recommendation);
    updateNotifications();
    return notification;
  };

  const addReminderNotification = (reminderType, details) => {
    const notification = notificationManager.addReminderNotification(reminderType, details);
    updateNotifications();
    return notification;
  };

  const markNotificationAsRead = (notificationId) => {
    notificationManager.markAsRead(notificationId);
    updateNotifications();
  };

  const clearAllNotifications = () => {
    notificationManager.clearNotifications();
    updateNotifications();
  };

  const getUnreadCount = () => {
    return notificationManager.getUnreadCount();
  };

  // Update username if it changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername && storedUsername !== username) {
        setUsername(storedUsername);
        setNotificationManager(new NotificationManager(storedUsername));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [username]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addAchievementNotification,
        addProgressNotification,
        addRecommendationNotification,
        addReminderNotification,
        markNotificationAsRead,
        clearAllNotifications,
        getUnreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};