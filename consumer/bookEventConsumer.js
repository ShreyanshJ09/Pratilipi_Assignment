const messageQueue = require('../utils/messageQueue');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

async function startConsumer() {
  try {
    await messageQueue.connect();
    await messageQueue.subscribe('book-events', async (message) => {
      console.log('Received message from queue:', message);
      
      if (message.type === 'BOOK_CREATED') {
        try {
          const bookData = message.data;

          if (!bookData.title || !bookData.author) {
            console.warn('Missing title or author in book data:', bookData);
          }

          const users = await User.find({});
          console.log(`Found ${users.length} users to notify about new book`);

          for (const user of users) {
            const notification = new Notification({
              userId: user._id,
              type: 'new_book',
              content: `A new book "${bookData.title}" by ${bookData.author} is now available!`,
              sentAt: new Date(),
              read: false
            });

            await notification.save();
            console.log(`Created notification for user ${user._id}`);
          }
        } catch (error) {
          console.error('Error processing book event:', error);
        }
      }
    });

    console.log('Book event consumer started successfully');
  } catch (error) {
    console.error('Failed to start book event consumer:', error);
    setTimeout(startConsumer, 5000);
  }
}

module.exports = { startConsumer };
