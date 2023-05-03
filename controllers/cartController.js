var Product = require("../models/product");
var User = require("../models/user");
var Cart = require("../models/cart");
var Orders = require("../models/orders");

exports.addItemToCart = async function (req, res, next){
    var id = req.params.productId;
    var userid = req.user;
    let data = null;

    var product = await Product.findOne({productId: id});
    var user = await User.findOne({login: userid});
    var cart = await Cart.findOne({userId: user._id});
    //if cart exist for this user
    if(user){
        if(cart){
            var itemIndex = cart.products.findIndex(p => p.productId == id);
            //if product exists in the cart update
            if(itemIndex > -1){
                cart.products[itemIndex].quantity += 1;
            }else{
                cart.products.push({
                    productId: id,
                    quantity: 1,
                    name: product.productName,
                    price: product.price,
                    image: product.imagePath,
                });
            }
            res.redirect('back');
            data = await cart.save();

        }else{
            //cart doesn't exist for this user
            var newCart = {
                userId: user._id,
                products: [{
                    productId: id,
                    quantity: 1,
                    name: product.productName,
                    price: product.price,
                    image: product.imagePath,
                }]
            };
            cart = new Cart(newCart);
            res.redirect('back');
            data = await cart.save();
        }
    }
}

exports.showCart = async function (req, res, next){
    var userid = req.user;
    var user = await User.findOne({login: userid});
    if(user){
        let cart = await Cart.findOne({ userId: user._id });
        if(cart != null){
            res.render('cart', {cart: cart.products, user: req.user});
        }else{
            res.render('cart', {cart: [], user: req.user});
        }  
    }else{
        let cart = [];
        res.render('cart', {cart: cart, user: req.user});
    }
}

exports.removeItem = async function(req, res, next){
    var userid = req.user;
    var user = await User.findOne({login: userid});
    var cart = await Cart.findOne({userId: user._id});
    var id = req.params.productId;
    var productIndex = cart.products.findIndex((p) => p.productId == id);
    if(productIndex > -1){
        cart.products.splice(productIndex, 1);
        cart = await cart.save();
    }
    res.redirect('back');
}

exports.incrementQuantity = async function(req, res, next){
    var userid = req.user;
    var user = await User.findOne({login: userid});
    var cart = await Cart.findOne({userId: user._id});
    var id = req.params.productId;
    var productIndex = cart.products.findIndex((p) => p.productId == id);
    if(productIndex > -1){
        var product = cart.products[productIndex];
        product.quantity += 1;
        cart.products[productIndex] = product;
        cart = await cart.save();
    }
    res.redirect('back');
}

exports.decrementQuantity = async function(req, res, next){
    var userid = req.user;
    var user = await User.findOne({login: userid});
    var cart = await Cart.findOne({userId: user._id});
    var id = req.params.productId;
    var productIndex = cart.products.findIndex((p) => p.productId == id);
    if(productIndex > -1){
        var product = cart.products[productIndex];
        if(product.quantity > 1){
            product.quantity -= 1;
            cart.products[productIndex] = product;
            cart = await cart.save();
        }
    }
    res.redirect('back');
}

exports.orderCart = async function(req, res, next){
    var userid = req.user;
    var user = await User.findOne({login: userid});
    var cart = await Cart.findOne({userId: user._id});
    var order = await Orders.findOne({userId: user._id});

    if(cart.products != undefined && cart.products.length > 0){
        if(order){
            order.orders.push(cart.products)
            order = await order.save();
        }else{
            var newOrder = {
                userId: user._id,
                orders: [cart.products]
            }
            order = new Orders(newOrder);
            order = await order.save();
        }
        cart.products = [];
        cart = await cart.save();
    }
    res.redirect('back');
}