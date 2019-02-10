const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render(`admin/addProduct`, {
        path: `/admin/add-products`,
    });
};

exports.postAddProduct = (req, res, next) => {
    const {body: {title, price, description}, file}  = req;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: file.path
    });
    product.save()
        .then(result => {
            console.log('Product created')
            res.redirect('/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}