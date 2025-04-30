const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['new_book', 'related_books','stock_alert','promotion','order_update']
  },
  content: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

notificationSchema.statics.getNotificationsByUser = function (userId) {
  return this.find({ userId });
};

notificationSchema.statics.getUnreadNotificationsByUser = function (userId) {
  return this.find({ userId, read: false });
};

notificationSchema.statics.markNotificationAsRead = function (id) {
  return this.findByIdAndUpdate(id, { read: true }, { new: true });
};

notificationSchema.statics.createNotification = function (notificationData) {
  const notification = new this(notificationData);
  return notification.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
