const express = require('express');
const { addBook, getAllBooks,notifyOrderStatus } = require('../controllers/bookController');
const authenticationMiddleware = require('../middleware/authentication');
const router = express.Router();

router.post('/add', (req, res) => {
    addBook(req, res);
});
router.get('/all',(req, res) => {
    getAllBooks(req, res);
});  
router.post('/order/:bookId',authenticationMiddleware, (req, res) => {
    notifyOrderStatus(req, res);
});
module.exports = router;

