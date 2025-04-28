const express = require('express');
const router = express.Router();
const { 
  getUserNotifications, 
  getUnreadNotifications, 
  markAsRead, 
  createNotification
} = require('../controllers/notificationController');
const authenticationMiddleware = require('../middleware/authentication'); // adjust path


// Get all notifications for the authenticated user
router.get('/', authenticationMiddleware, getUserNotifications);

// Get unread notifications for the authenticated user
router.get('/unread', authenticationMiddleware, getUnreadNotifications);

// Mark a notification as read
router.put('/:id/read', authenticationMiddleware, markAsRead);

// Create a notification (optional - admin trigger maybe)
router.post('/', authenticationMiddleware, createNotification);



module.exports = router;
