const express = require('express');
const {registerUser} = require('../controllers/userController');
const router = express.Router();

router.post('/register', (req, res) => {
    registerUser(req, res);
});



module.exports = router;