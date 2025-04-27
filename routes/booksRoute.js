const express = require('express');
const { addBook, getAllBooks } = require('../controllers/bookController');
const router = express.Router();

router.post('/add', (req, res) => {
    addBook(req, res);
});
router.get('/all',(req, res) => {
    getAllBooks(req, res);
});  
module.exports = router;

