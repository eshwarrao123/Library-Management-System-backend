const Book = require('../models/Book');

// POST /api/books — Librarian only
const addBook = async (req, res) => {
    try {
        const { title, author, isbn, category, quantity } = req.body;

        // Check duplicate ISBN
        const existing = await Book.findOne({ isbn });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
        }

        const book = await Book.create({
            title,
            author,
            isbn,
            category,
            quantity,
            availableQuantity: quantity  // on creation, all copies are available
        });

        res.status(201).json({ success: true, message: 'Book added successfully', data: book });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/books — All authenticated users
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({ success: true, count: books.length, data: books });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/books/:id — All authenticated users
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        res.status(200).json({ success: true, data: book });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/books/:id — Librarian only
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        const { title, author, isbn, category, quantity } = req.body;

        // If quantity is being updated, adjust availableQuantity accordingly
        if (quantity !== undefined) {
            const borrowedCount = book.quantity - book.availableQuantity;
            const newAvailable = quantity - borrowedCount;

            if (newAvailable < 0) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot reduce quantity below borrowed count (${borrowedCount} copies currently borrowed)`
                });
            }

            book.availableQuantity = newAvailable;
            book.quantity = quantity;
        }

        if (title) book.title = title;
        if (author) book.author = author;
        if (isbn) book.isbn = isbn;
        if (category) book.category = category;

        await book.save();

        res.status(200).json({ success: true, message: 'Book updated successfully', data: book });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/books/:id — Librarian only
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        await book.deleteOne();

        res.status(200).json({ success: true, message: 'Book deleted successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook };