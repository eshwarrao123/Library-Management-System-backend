const express = require('express');
const router = express.Router();
const { addBook, getAllBooks, getBookById, updateBook, deleteBook } = require('../controllers/bookController');
const { borrowBook, returnBook } = require('../controllers/borrowController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { bookValidation, mongoIdValidation } = require('../validators/validationRules');
const { validate } = require('../middleware/validationMiddleware');

router.get('/', protect, getAllBooks);
router.get('/:id', protect, mongoIdValidation('id'), validate, getBookById);
router.post('/', protect, authorizeRoles('librarian'), bookValidation, validate, addBook);
router.put('/:id', protect, authorizeRoles('librarian'), mongoIdValidation('id'), validate, updateBook);
router.delete('/:id', protect, authorizeRoles('librarian'), mongoIdValidation('id'), validate, deleteBook);

router.post('/:id/borrow', protect, authorizeRoles('member'), mongoIdValidation('id'), validate, borrowBook);
router.post('/:id/return', protect, authorizeRoles('member'), mongoIdValidation('id'), validate, returnBook);

module.exports = router;