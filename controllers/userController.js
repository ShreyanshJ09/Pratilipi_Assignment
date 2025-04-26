const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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

module.exports ={
    registerUser,
    loginUser,
}