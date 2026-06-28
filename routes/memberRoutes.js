const express = require('express');
const router = express.Router();
const { getAllMembers, deleteMember } = require('../controllers/memberController');
const { getMyBooks } = require('../controllers/borrowController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { mongoIdValidation } = require('../validators/validationRules');
const { validate } = require('../middleware/validationMiddleware');

router.get('/me/books', protect, authorizeRoles('member'), getMyBooks);
router.get('/', protect, authorizeRoles('librarian'), getAllMembers);
router.delete('/:id', protect, authorizeRoles('librarian'), mongoIdValidation('id'), validate, deleteMember);

module.exports = router;