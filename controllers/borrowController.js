const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

// POST /api/books/:id/borrow — Member only
const borrowBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        // Check book exists
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        // Check availability
        if (book.availableQuantity <= 0) {
            return res.status(400).json({ success: false, message: 'Book is currently unavailable' });
        }

        // Check if member already borrowed this book and hasn't returned it
        const alreadyBorrowed = await Borrow.findOne({
            memberId: req.user._id,
            bookId: req.params.id,
            status: 'borrowed'
        });

        if (alreadyBorrowed) {
            return res.status(400).json({
                success: false,
                message: 'You have already borrowed this book. Return it before borrowing again'
            });
        }

        // Create borrow record
        const borrowRecord = await Borrow.create({
            memberId: req.user._id,
            bookId: req.params.id
        });

        // Decrease available quantity
        book.availableQuantity -= 1;
        await book.save();

        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrowRecord
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/books/:id/return — Member only
const returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        // Check book exists
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        // Find active borrow record for this member
        const borrowRecord = await Borrow.findOne({
            memberId: req.user._id,
            bookId: req.params.id,
            status: 'borrowed'
        });

        if (!borrowRecord) {
            return res.status(400).json({
                success: false,
                message: 'No active borrow record found for this book'
            });
        }

        // Update borrow record
        borrowRecord.status = 'returned';
        borrowRecord.returnDate = Date.now();
        await borrowRecord.save();

        // Increase available quantity
        book.availableQuantity += 1;
        await book.save();

        res.status(200).json({
            success: true,
            message: 'Book returned successfully',
            data: borrowRecord
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/members/me/books — Member only
const getMyBooks = async (req, res) => {
    try {
        const borrowedBooks = await Borrow.find({
            memberId: req.user._id,
            status: 'borrowed'
        }).populate('bookId', 'title author isbn category');

        res.status(200).json({
            success: true,
            count: borrowedBooks.length,
            data: borrowedBooks
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { borrowBook, returnBook, getMyBooks };