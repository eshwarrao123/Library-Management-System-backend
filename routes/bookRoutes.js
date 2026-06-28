const express = require('express');
const router = express.Router();
const { addBook, getAllBooks, getBookById, updateBook, deleteBook } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All routes require login
router.get('/', protect, getAllBooks);
router.get('/:id', protect, getBookById);

// Librarian only
router.post('/', protect, authorizeRoles('librarian'), addBook);
router.put('/:id', protect, authorizeRoles('librarian'), updateBook);
router.delete('/:id', protect, authorizeRoles('librarian'), deleteBook);

module.exports = router;