const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');

const MONGODB_URI = `mongodb://localhost:27017/shop`;
// exports.MONGODB_URI = MONGODB_URI;

// exports.store = new mongoDBStore({
//     uri: MONGODB_URI,
//     collection: `sessions`,
// });

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/products');
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

exports.addProductFilesMidlevare = multer({storage: fileStorage, fileFilter: fileFilter}).single(`image`);