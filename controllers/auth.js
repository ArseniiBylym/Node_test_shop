const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render(`auth/login`, {
        path: `/login`,
    });
};

exports.postLogin = (req, res, next) => {
    const {email, password}  = req.body;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                res.redirect('/signin');
            }
            bcrypt
                .compare(password, user.password)
                .then(result => {
                    if (!result) {
                        console.log('Wrong password')
                        res.redirect('/signin');
                    } else {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log('error');
                            res.redirect('/');
                        })
                    }
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getSignin = (req, res, next) => {
    res.render(`auth/signin`, {
        path: `/signin`,
    });
};

exports.postSignin = (req, res, next) => {
    const {name, email, password, confPassword} = req.body;

    bcrypt
        .hash(password, 12)
        .then(hPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hPassword,
            });
            return user.save();
        })
        .then(user => {
            res.redirect('/login');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    })
}