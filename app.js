const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');


const errorController = require(`./controllers/error`);
const User = require('./models/user');
const MONGODB_URI = `mongodb://localhost:27017/shop`;

const app = express();
const store = new mongoDBStore({
    uri: MONGODB_URI,
    collection: `sessions`,
});
// const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Math.random() + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype  === `image/png` || file.mimetype === `image/jpg` || file.mimetype === `image/jpeg`) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


app.set(`view engine`, `ejs`);
app.set(`views`, `views`)

const shopRoutes = require(`./routes/shop`);
const adminRoutes = require('./routes/admin');
const authRoutes = require(`./routes/auth`);

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single(`image`));
app.use(express.static(path.join(__dirname, `public`)));
app.use(`/images`, express.static(path.join(__dirname, `images`)));
app.use(
    session({
        secret: `secretkeyforsession`,
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
// app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
    res.locals.isAuth = req.session.isLoggedIn,
    // res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            };
            res.user = user;
            next();
        })
        .catch(error => {
            next(new Error(error));
        });
});

app.use(shopRoutes);
app.use(adminRoutes);
app.use(authRoutes);
app.get(`/500`, errorController.get500);
app.use(errorController.get404);
// app.use((error, req, res, next) => {
//     res.status(500).render(`500`, {
//         path: `/500`,
//         isAuth: req.session.isLoggedIn
//     });
// });

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT || 3030);
    })
    .catch(error => {
        console.log(error);
    });

