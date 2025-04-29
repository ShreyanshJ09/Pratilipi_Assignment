const express = require('express');
const router = express.Router();
const { 
  getUserNotifications, 
  getUnreadNotifications, 
  markAsRead, 
  createNotification
} = require('../controllers/notificationController');
const authenticationMiddleware = require('../middleware/authentication'); 

        
router.get('/', authenticationMiddleware, getUserNotifications);
router.get('/unread', authenticationMiddleware, getUnreadNotifications);
router.put('/:id/read', authenticationMiddleware, markAsRead);
router.post('/', authenticationMiddleware, createNotification);



module.exports = router;
