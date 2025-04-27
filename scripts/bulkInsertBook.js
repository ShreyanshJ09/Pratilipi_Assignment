const mongoose = require('mongoose');
const Book = require('../models/bookModel');
const booksData = require('../books_data_fixed.json');

const username = 'shreyanshjangitwar';
const password = '242646';
const MONGO_URI = `mongodb+srv://${username}:${password}@cluster0.y0oweop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const bulkInsert = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected');

        console.log('Inserting books...');

        await Book.insertMany(booksData, { ordered: false });

        console.log('Books inserted successfully');
        
        // Exit the process after successful insertion
        process.exit(0); 
    } catch (error) {
        // Log error if something goes wrong
        console.error('Error inserting books:', error);
        process.exit(1); // Exit with an error code
    }
};

bulkInsert();
