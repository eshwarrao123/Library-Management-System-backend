const { body, param } = require('express-validator');

const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Enter a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Enter a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
];

const bookValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required'),

    body('author')
        .trim()
        .notEmpty().withMessage('Author is required'),

    body('isbn')
        .trim()
        .notEmpty().withMessage('ISBN is required'),

    body('category')
        .trim()
        .notEmpty().withMessage('Category is required'),

    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 0 }).withMessage('Quantity must be a non-negative number')
];

const mongoIdValidation = (field) => [
    param(field)
        .isMongoId().withMessage(`Invalid ${field} format`)
];

module.exports = {
    registerValidation,
    loginValidation,
    bookValidation,
    mongoIdValidation
};