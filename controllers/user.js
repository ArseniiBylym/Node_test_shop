const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

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
            res.render('user/cart', {
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
                    return res.redirect('/user/cart')
                })
        })
}

exports.comfirmOrder = async (req, res, next) => {
    let {fullOrder} = req.body;
    fullOrder = JSON.parse(fullOrder);
    console.log(fullOrder)

    let totalPrice = 0;
    
    fullOrder.forEach((value, i) => {
        totalPrice += +value.price;
    })

    const lastIndex = await Order.find({}).count()
        
    console.log('last index: ', lastIndex);
    const currentIndex = lastIndex > 0 ? lastIndex + 1 : 1;

    const order = new Order({
        index: currentIndex,
        date: new Date,
        status: 'pending',
        products: fullOrder,
        totalPrice: totalPrice,
        userId: req.session.user._id
    });
    order.save()
        .then(orderResult => {
            User.findById(req.session.user._id)
            .then(user => {
                user.cart = [];
                user.save()
                    .then(result => {
                        req.flash('infoMessage', "Thanks for your order! We'll contact with you soon.")
                        return res.redirect('/user/cart')
                    })
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getUserOrders = (req, res, next) => {
    const userId = req.session.user._id;

    Order.find({userId: userId})
        .then(orders => {
            console.log(orders);
            res.render('user/orders', {
                path: '/user/orders',
                orders: orders,
            })
        })
}
