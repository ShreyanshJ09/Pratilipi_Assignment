const messageQueue = require('../utils/messageQueue');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Notification = require('../models/notificationModel');

async function startUserOrderConsumer() {
  try {
    await messageQueue.connect();
    await messageQueue.subscribe('user-events_forOrder', async (message) => {
      console.log('Received message from queue:', message);

      if (message.type === 'PREVIOUS_ORDERS_UPDATED') {
        try {
          const { email, book_id } = message.data;

          if (!email || !book_id) {
            console.warn('Missing email or book_id in message:', message.data);
            return;
          }

          // Get user
          const user = await User.findOne({ email });
          if (!user) {
            console.warn(`User with email ${email} not found`);
            return;
          }

          // Get ordered book
          const orderedBook = await Book.findById(book_id);
          if (!orderedBook) {
            console.warn(`Book with ID ${book_id} not found`);
            return;
          }

          const author = orderedBook.author;

          // Get other books by same author (excluding the ordered one)
          const relatedBooks = await Book.find({ 
            author, 
            _id: { $ne: book_id } 
          });

          if (!relatedBooks.length) {
            console.log(`No other books found by ${author} for user ${email}`);
            return;
          }

          // Create notification content
          const bookList = relatedBooks.map(b => `• ${b.book_name}`).join('\n');
          const notificationText = `You ordered "${orderedBook.book_name}". Check out more books by ${author}:\n${bookList}`;

          // Save notification
          const notification = new Notification({
            userId: user._id,
            type: 'related_books',
            content: notificationText,
            sentAt: new Date(),
            read: false
          });

          await notification.save();
          console.log(`Notification sent to ${email}`);

        } catch (error) {
          console.error('Error processing PREVIOUS_ORDERS_UPDATED event:', error);
        }
      }
    });

    console.log('User order event consumer started successfully');
  } catch (error) {
    console.error('Failed to start user order event consumer:', error);
    setTimeout(startUserOrderConsumer, 5000);
  }
}

module.exports = { startUserOrderConsumer };
