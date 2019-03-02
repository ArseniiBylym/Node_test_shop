const Product = require('../models/product');

exports.getHomePage = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render(`shop/homePage`, {
                products: products,
                path: `/`,
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render(`shop/products`, {
                products: products,
                path: `/products`,
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProductItem = (req, res, next) => {
    const id = req.params.id
    Product.findById(id)
        .then(result => {
            if (!result) {
                res.redirect('/500');
            }
            res.render('shop/product-item', {
                product: result,
                path: '/products',
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}
