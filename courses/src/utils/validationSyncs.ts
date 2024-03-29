import { body } from 'express-validator';

export const userValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Email must be valid'),
        body('name')
            .isLength({ min: 4, max: 10})
            .withMessage('username must be between 4 and 10 characters'),
        body('password')
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters'),
    ];
}

export const userSigninValidationRules = () => {
    return [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must provide a password')     
    ]
}