const Book = require('../models/bookModel');
const messageQueue=require('../utils/messageQueue');

const Notification = require('../models/notificationModel');

    const addBook = async (req, res) => {
    try {
        const bookData = req.body;
        const newBook = await Book.addBook(bookData);

        console.log('Book added:', newBook);

        await messageQueue.publish('book-events', {
            type: 'BOOK_CREATED',
            data: {
                _id: newBook._id,
                title: newBook.book_name,
                author: newBook.author
            }
        });

        res.status(201).json({ 
            message: 'Book added successfully', 
            book: newBook 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const getAllBooks = async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.status(200).json({ books });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const notifyOrderStatus = async (req, res) => {
    const { bookId } = req.params;
    const user = req.user;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const dispatchNotification = new Notification({
            userId: user._id,
            type: 'order_update',
            content: `Your order for "${book.book_name}" has been dispatched.`,
            sentAt: new Date(),
            read: false,
        });
        await dispatchNotification.save();

        console.log(`[Dispatch] Notification sent to ${user.email}`);

        setTimeout(async () => {
            const deliveryNotification = new Notification({
                userId: user._id,
                type: 'order_update',
                content: `Your order for "${book.book_name}" is out for delivery.`,
                sentAt: new Date(),
                read: false,
            });
            await deliveryNotification.save();

            console.log(`[Delivery] Notification sent to ${user.email}`);
        }, 6 * 60 * 60 * 1000); 

        res.status(200).json({ message: 'Order notifications scheduled successfully' });
    } catch (error) {
        console.error('Error in notifyOrderStatus:', error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    addBook,
    getAllBooks,
    notifyOrderStatus
};
