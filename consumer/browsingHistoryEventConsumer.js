const messageQueue = require('../utils/messageQueue');
const User = require('../models/userModel');
const Book = require('../models/bookModel'); 
const Notification = require('../models/notificationModel');

async function startBrowsingEventConsumer() {
  try {
    await messageQueue.connect();

    await messageQueue.subscribe('user-events_forBrowising', async (message) => {
      console.log('Received message from queue:', message);

      if (message.type === 'BROWSING_HISTORY_UPDATED') {
        try {
          const { email, book_id } = message.data;

          const user = await User.findOne({ email });
          const book = await Book.findById(book_id);

          const notification = new Notification({
            userId: user._id,
            type: 'stock_alert', 
            content: `The book "${book.book_name}" is selling fast and may go out of stock soon!`,
            sentAt: new Date(),
            read: false
          });

          await notification.save();
          console.log(`notification sent to ${email}`);
        } catch (err) {
          console.error('Error processing BROWSING_HISTORY_UPDATED event:', err);
        }
      }
    });

    console.log('Browsing history consumer started successfully');
  } catch (error) {
    console.error('Failed to start browsing history consumer:', error);
    setTimeout(startBrowsingEventConsumer, 5000); 
  }
}

module.exports = {  startBrowsingEventConsumer };
