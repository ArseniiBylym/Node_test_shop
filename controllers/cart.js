const Product = require('../models/product');
const User = require('../models/user')

exports.getUserCart = (req, res, next) => {
    res.render(`cart/cart`, {
        path: `/cart`,
    })
}

exports.addToCart = (req, res, next) => {
    const { product, userId } = req.body;
    console.log('User is: ', userId)
    console.log(product)
    Product.findById(product)
        .then(prod => {
            console.log(prod);
            if(!prod) {
                console.log('Product not found');
                return res.redirect('/products');
            }
            User.findById(userId)
                .then(user => {
                    user.cart.push(prod);
                    user.save()
                        .then(result => {
                            console.log('Product add to user cart');
                            return res.redirect('/products')
                        })
                })
        })
}
