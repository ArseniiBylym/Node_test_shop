const Product = require('../models/product');
const User = require('../models/user')

exports.getUserCart = (req, res, next) => {

    User.findById(req.session.user._id)
        .then(user => {
            if(!user) {
                return res.redirect('/products')
            }
            let totalPrice = 0;
            if (user.cart.length > 0) {
               user.cart.forEach(item => {
                    totalPrice += +item.price
                })
            }
            console.log('Total ptice is', totalPrice);
            res.render('cart/cart', {
                path: '/cart',
                totalPrice: totalPrice
            })
            
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
                            req.flash('infoMessage', "Product added to the cart")
                            return res.redirect('/products')
                        })
                })
        })
}

exports.removeFromCart = (req, res, next) => {
    const {productId} = req.body;

    User.findById(req.session.user._id)
        .then(user => {
            user.cart = user.cart.filter(item => item._id.toString() !== productId.toString())
            user.save()
                .then(result => {
                    console.log('Product removed from user cart');
                    req.flash('infoMessage', "Product was removed from the cart")
                    return res.redirect('/cart')
                })
        })
}

exports.comfirmOrder = (req, res, next) => {
    const {fullOrder} = req.body;

    console.log("Full order is", fullOrder);
    User.findById(req.session.user._id)
    .then(user => {
        user.cart = [];
        user.save()
            .then(result => {
                console.log('Order sended to manager and cart is cleared');
                req.flash('infoMessage', "Thanks for your order! We'll contact with you soon.")
                return res.redirect('/cart')
            })
    })

}
