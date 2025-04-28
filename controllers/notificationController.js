const Notification = require('../models/notificationModel');


const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id; 
    const notifications = await Notification.getNotificationsByUser(userId);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};


const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.getUnreadNotificationsByUser(userId);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unread notifications' });
  }
};


const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.markNotificationAsRead(id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
};

// This createNotification function is likely only used internally (admin trigger)
const createNotification = async (req, res) => {
  try {
    const notificationData = req.body;
    const notification = await Notification.createNotification(notificationData);

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, message: 'Failed to create notification' });
  }
};


module.exports={
    createNotification,
    markAsRead,
    getUnreadNotifications,
    getUserNotifications,
}
