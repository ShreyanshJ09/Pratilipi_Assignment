const mongoose = require('mongoose');

const username = `shreyanshjangitwar`;
const password = `242646`;

const url = `mongodb+srv://${username}:${password}@cluster0.y0oweop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

async function connectToDatabase() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
}

module.exports = connectToDatabase;
