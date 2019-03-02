const {check, body} = require('express-validator/check');
const User = require('../models/user');

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