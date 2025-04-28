const Book = require('../models/bookModel');
const messageQueue=require('../utils/messageQueue');

const addBook = async (req, res) => {
    try {
        const bookData = req.body;
        const newBook = await Book.addBook(bookData);
        await messageQueue.publish('book-events', {
            type: 'BOOK_CREATED',
            data: newBook
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

module.exports = {
    addBook,
    getAllBooks
};
