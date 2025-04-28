const express = require('express');
const {registerUser,loginUser,getUserProfile,updatePreference,updateHistory} = require('../controllers/userController');
const authenticationMiddleware = require('../middleware/authentication');
const router = express.Router();

router.post('/register', (req, res) => {
    registerUser(req, res);
});

router.get('/login', (req, res) => {
    loginUser(req, res);
});

router.get('/profile', (req, res) => {
    getUserProfile(req, res);
});

router.put('/preference',authenticationMiddleware, (req, res) => {
    updatePreference(req, res);
});

router.post('/history',authenticationMiddleware, (req, res) => {
    updateHistory(req, res);
});


module.exports = router;