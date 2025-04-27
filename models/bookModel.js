const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    book_name: {
        type: String,
        required: true,
        unique: true,  
        trim: true
    },
    languages: {
        type: [String],
        enum: ["English", "Hindi", "Bengali", "Marathi"], 
        required: true
    },
    genre: {
        type: String,
        required: true,
        enum: [
            "Fiction", 
            "Non-fiction", 
            "Fantasy", 
            "Science Fiction", 
            "Romance", 
            "Thriller", 
            "Biography", 
            "Historical", 
            "Mystery", 
            "Adventure"
        ]
    },
    price: {
        type: Number,
        required: true,
        min: 0  
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5  
    }
}, {
    timestamps: true,
    collection: 'books'  
});
bookSchema.statics.addBook = async function (bookData) {
    try {
        const book = new this(bookData);
        const newBook = await book.save();
        return newBook;
    } catch (error) {
        throw new Error('Error adding book: ' + error.message);
    }
};

bookSchema.statics.getAllBooks = async function () {
    try {
        const books = await this.find();
        return books;
    } catch (error) {
        throw new Error('Error fetching books: ' + error.message);
    }
};


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
