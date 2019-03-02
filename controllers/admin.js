const Product = require('../models/product');
const Order = require('../models/order');
const deleteFile = require('../utils/file').deleteFile;
const {validationResult} = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
    res.render(`admin/addProduct`, {
        path: `/admin/add-products`,
        defaultValues: {
            title: '',
            price: '',
            description: '',
        },
        validationErrors: []
    });
};

exports.postAddProduct = (req, res, next) => {
    const {body: {title, price, description}, file}  = req;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const validationErrors = {}
        errors.array().forEach((item, i) => {
            validationErrors[item.param] = item.msg
        });
        return  res.status(422).render('admin/addProduct', {
            path: '/admin/add-products',
            defaultValues: {
                title: title,
                price: price,
                description: description,
            },
            validationErrors: validationErrors
        });
    }

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: file.path
    });
    product.save()
        .then(result => {
            req.flash('infoMessage', 'New product was successfully added')
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
    Product.findByIdAndDelete(productID)
        .then(result => {
            if (!result) {
                res.redirect('/products');
                return;
            }
            return result;
        })
        .then(result => {
            req.flash('infoMessage', 'Product was successfully deleted')
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
    Product.findById(productID)
        .then(result => {
            if (!result) {
                console.log('Product not found');
                res.redirect('/products')
            }
            return result;
        })
        .then(product => {
            res.render('admin/editProduct', {
                product: product,
                path: '/admin/edit-product'
            })
        })
    }
    
    exports.postEditProduct = (req, res, next) => {
        const { productID, title, price, description} = req.body;
        const image = req.file
        Product.findById(productID)
        .then(product => {
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
                req.flash('infoMessage', 'Product was successfully updated')
                res.redirect('/products');
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getAllOrders = async (req, res, next) => {
    let allOrders = await Order.find();
    res.render('admin/allOrders', {
        path: '/admin/all-orders',
        orders: allOrders
    })
}

exports.changeOrderStatus = (req, res, next) => {
    const {orderId, status} = req.body;
    Order.findById(orderId)
        .then(order => {
            order.status = status;
            order.save()
                .then(result => {
                    req.flash('infoMessage', 'Order status has changed')
                    res.redirect('/admin/all-orders')
                }) 
        })
}