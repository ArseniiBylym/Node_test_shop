const Product = require('../models/product');
const Order = require('../models/order');
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
    console.log(allOrders[0].status)
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