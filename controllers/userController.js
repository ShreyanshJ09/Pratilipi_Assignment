const User = require('../models/userModel');


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const new_user = await User.register(name, email, password);
        res.status(201).json(new_user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports ={
    registerUser,
}