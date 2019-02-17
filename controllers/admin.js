const Product = require('../models/product');
const deleteFile = require('../utils/file').deleteFile;

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
    const productID = req.params.productID;
    console.log(productID);
    Product.findById(productID)
        .then(result => {
            if (!result) {
                console.log('Product not found');
                res.redirect('/products')
            }
            return result;
        })
        .then(product => {
            console.log(product)
            res.render('admin/editProduct', {
                product: product,
                path: '/admin/edit-product'
            })
        })
}

exports.postEditProduct = (req, res, next) => {
    console.log(req.body);
    const { productID, title, price, description} = req.body;
    const image = req.file
    console.log(productID);
    Product.findById(productID)
        .then(product => {
            console.log(product);
            product.title = title || product.title;
            product.price = price || product.price;
            product.description = description;
            if (image) {
                deleteFile(product.imageUrl);
                product.imageUrl = image.path
            }
            return product.save()
                .then(result => {
                    console.log('Product updated');
                    res.redirect('/products');
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })

}