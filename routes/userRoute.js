const express = require('express');
const {registerUser,loginUser} = require('../controllers/userController');
const router = express.Router();

router.post('/register', (req, res) => {
    registerUser(req, res);
});

router.get('/login', (req, res) => {
    loginUser(req, res);
});



module.exports = router;