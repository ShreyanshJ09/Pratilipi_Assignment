const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const messageQueue= require('../utils/messageQueue');

const JWT_SECRET = `XYZ`; 

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const new_user = await User.register(name, email, password);
        res.status(201).json(new_user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Email and Password are required');
        }
        const user = await User.login(email, password);
        const token = jwt.sign({ email: user.email }, JWT_SECRET);

        return res.status(200).json({
            message: 'User logged in successfully',
            token: token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded || !decoded.email){
            return res.status(401).json({ message: 'Invalid token' });
        }
        const user = await User.getUser(decoded.email);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: "User Profile Retrieved Successfully",
            user: {
                id: user._id,
                name: user.name, 
                email: user.email,
                cart: user.cart,
                previous_order: user.previous_order,
                preferences: user.preferences,
                history: user.history,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

const updatePreference = async (req, res) => {
    try {
        const user = req.user;
        const { language, genre } = req.body;

        if (!language && !genre) {
            return res.status(400).json({ message: 'No preferences provided to update' });
        }

        const updatedPreferences = await User.updateUserPreferences(user.email, { language, genre });

        res.status(200).json({
            message: 'Preferences updated successfully',
            preferences: updatedPreferences
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateBrowsingHistory = async (req, res) => {
    try {
        const user = req.user;
        const { book_id } = req.body;

        if (!book_id) {
            return res.status(400).json({ message: 'book_id is required' });
        }

        const updatedHistory = await User.updateBrowsingHistory(user.email, book_id);

        await messageQueue.publish('user-events_forBrowising', {
            type: 'BROWSING_HISTORY_UPDATED',
            data: {
                email: user.email,
                book_id: book_id
            }
        });

        res.status(200).json({
            message: 'Browsing history updated successfully',
            browsingHistory: updatedHistory
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const updatePreviousOrders = async (req, res) => {
    try {
        const user = req.user;
        const { book_id } = req.body;

        if (!book_id) {
            return res.status(400).json({ message: 'book_id is required' });
        }

        const updatedOrders = await User.updatePreviousOrders(user.email, book_id);

        await messageQueue.publish('user-events_forOrder', {
            type: 'PREVIOUS_ORDERS_UPDATED',
            data: {
                email: user.email,
                book_id: book_id
            }
        });

        res.status(200).json({
            message: 'Previous orders updated successfully',
            previous_orders: updatedOrders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports ={
    registerUser,
    loginUser,
    getUserProfile,
    updatePreference,
    updateBrowsingHistory,
    updatePreviousOrders
}