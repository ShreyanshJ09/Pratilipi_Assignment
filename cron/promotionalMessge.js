const cron = require('node-cron');
const quotes = require('../utils/quote');
const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

const sendPromotionalNotifications = async () => {
  try {
    const users = await User.find({});
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    const notifications = users.map((user) => ({
      userId: user._id,
      type: 'promotion',
      content: quote,
      sentAt: new Date(),
      read: false,
    }));

    await Notification.insertMany(notifications);
    console.log(` Sent promotional notifications at ${new Date().toISOString()}`);
  } catch (error) {
    console.error(' Error sending promotional notifications:', error);
  }
};

const startPromotionScheduler = () => {
    cron.schedule('*/10 * * * *', () => {
        sendPromotionalNotifications();
      });
//    cron.schedule('* * * * *', sendPromotionalNotifications);
       
  console.log(' Promotion scheduler initialized');
};

module.exports = startPromotionScheduler;
