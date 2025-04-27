const Book = require('../models/bookModel');

const addBook = async (req, res) => {
    try {
        const bookData = req.body;
        const newBook = await Book.addBook(bookData);
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
