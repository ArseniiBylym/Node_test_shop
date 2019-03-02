const {check, body} = require('express-validator/check');
const User = require('../models/user');

exports.addProductValidator = [
    body('title')
        .trim()
        .isLength({min: 1})
        .withMessage('Please enter the product name'),
    body('price')
        .trim()
        .isFloat({min: 1.00})
        .withMessage('Please set the product price'),
    body('description')
        .trim()
        .isLength({min: 10})
        .withMessage('Plese add the product description')
]

exports.signinValidator = [
    body('name', 'User name field is required and should contain at least 3 symbols')
        .trim()
        .isLength({min: 3}),
    body('email')
        .isEmail()
        .withMessage('Please enter the valid email address')
        .custom((value, {req}) => {
            return User.findOne({email: value})
                .then(user => {
                    if(user) {
                        return Promise.reject('Email exist already, please select another one')
                    }
                })
        })
        .normalizeEmail(),
    body('password', 'Password should contains at least 6 symbols')
        .trim()
        .isLength({min: 6}),
    body('confPassword')
        .trim()
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error('Passwords have to match')
            }
            return true
        })
]