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

exports.postDeleteProduct = (req, res, next) => {
    const {productID} = req.body;
    console.log(productID);
    Product.findByIdAndDelete(productID)
        .then(result => {
            if (!result) {
                console.log('Product not found');
                res.redirect('/products');
                return;
            }
            return result;
        })
        .then(result => {
            console.log('Product successfuly deleted')
            res.redirect('/products')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getEditProduct = (req, res, next) => {
    const {productID} = req.body;
    Product.findById(productID)
        .then(result => {
            if (!result) {
                console.log('Product not found');
                res.redirect('/products')
            }
            return result;
        })
        .then(product => {
            res.render('/admin/updateProduct', {
                product: product,
                path: '/admin/update-product'
            })
        })
}