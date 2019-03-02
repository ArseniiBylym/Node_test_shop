const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const {validationResult} = require('express-validator/check');

sgMail.setApiKey('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');
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
                req.flash('errorMessage', 'You are not autorised, try to create a new account')
                res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(result => {
                    if (!result) {
                        console.log('Wrong password')
                        req.flash('errorMessage', 'Wrong password or email')
                        res.redirect('/login');
                    } else {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
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
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confPassword: ''
        },
        validationErrors: {}
    });
};

exports.postSignin = (req, res, next) => {
    const {name, email, password, confPassword} = req.body;
    const errors = validationResult(req);
    

    if(!errors.isEmpty()) {
        const validationErrors = {}
        errors.array().forEach((item, i) => {
            validationErrors[item.param] = item.msg
        });
        return  res.status(422).render('auth/signin', {
            path: '/signin',
            defaultValues: {
                name: name,
                email: email,
                password: password,
                confPassword: confPassword
            },
            validationErrors: validationErrors
        });

            // return res.redirect('auth/signin')
    }

    // if(password !== confPassword) {
    //     req.flash('errorMessage', "Password doesn't matched, try again")
    //     return res.redirect('/login');
    // }

    bcrypt
        .hash(password, 12)
        .then(hPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hPassword,
                isAdmin: false,
                cart: []
            });
            return user.save();
        })
        .then(user => {
            req.flash('infoMessage', "New acount was successfully created, now you can login")
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

exports.getResetPassword = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
    })
}

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            req.flash('errorMessage', "Something went wrong, try again")
            return redirect('/reset')
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user){
                    req.flash('errorMessage', 'No account with that email found');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpDate = Date.now() + 60 * 60 * 1000; //1 hr
                return user.save()
            })
            .then(result => {
                res.redirect('/')
                const msg = {
                    to: req.body.email,
                    from: 'node-test-shop@example.com',
                    subject: `Reset password`,
                    html: `<p>You reset password on youre profile at Node-test-shop</p>
                    <p>Click this <a href='http://localhost:3030/reset/${token}'>link</a> to set a new password`
                };
                return sgMail.send(msg);
            })
            .catch(error => {
                console.log(error)
            })
    })   
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpDate: {$gt: Date.now()}})
        .then(user => {
            if(!user) {
                return res.redirect('/');
            }
            res.render('auth/new-password', {
                path: '/new-password',
                userId: user._id.toString(),
                passwordToken: token,
            })
        })
        .catch(error => {
            console.log(error)
        })
}

exports.postNewPassword = async (req, res, next) => {
    const { password, confirmPassword, userId, passwordToken} = req.body;

    if(password !== confirmPassword) {
        req.flash('errorMessage', "Password doesn't matched, try again")
        return res.redirect(`/reset/${passwordToken}`);
    }
    try {
        const user = await User.findOne({resetToken: passwordToken, resetTokenExpDate: {$gt: Date.now()}, _id: userId});
        const newHasherdPassword = await bcrypt.hash(password, 12);
        
        user.password = newHasherdPassword;
        user.resetToken = undefined;
        user.resetTokenExpDate = undefined;
        const savedUser = await user.save();
        req.flash('infoMessage', 'New password was successfully saved');
        res.redirect('/login')
    } catch (error) {
        console.log(error);
    }


}