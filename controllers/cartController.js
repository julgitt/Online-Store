const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const Orders = require("../models/orders");


class CartController {

    constructor() { }

    async addItemToCart(req, res, next) {
        try {
            var id = req.params.productId.toString();
            var userid = req.user;

            var product = await Product.findOne({ productId: id });
            var user = await User.findOne({ login: userid });
            var cart = await Cart.findOne({ userId: user._id });

            if (!product) {
                return res.status(404).send("Product not found");
            }

            if (!user) {
                return res.status(404).send("User not found");
            }

            if (cart) {
                const itemIndex = cart.products.findIndex(p => p.productId == id);
                if (itemIndex > -1) {
                    cart.products[itemIndex].quantity += 1;
                    await cart.save();
                } else {
                    cart.products.push({
                        productId: id,
                        quantity: 1,
                        name: product.productName,
                        price: product.price,
                        image: product.imagePath,
                    });
                    await cart.save();
                }
            } else {
                // Cart doesn't exist for this user
                newCart = new Cart({
                    userId: user._id,
                    products: [{
                        productId: id,
                        quantity: 1,
                        name: product.productName,
                        price: product.price,
                        image: product.imagePath,
                    }]
                });
                await newCart.save();
            }

            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }

    async showCart(req, res, next) {
        try {
            const userid = req.user;
            const user = await User.findOne({ login: userid });
            var cart = [];
            if (user) {
                cart = await Cart.findOne({ userId: user._id });
            }
            res.render("cart", { cart: cart.products || [], user: req.user });
        } catch (err) {
            next(err);
        }
    }

    async removeItem(req, res, next) {
        try {
            const userid = req.user;
            const user = await User.findOne({ login: userid });
            const cart = await Cart.findOne({ userId: user._id });
            const id = req.params.productId;
            const productIndex = cart.products.findIndex((p) => p.productId == id);

            if (productIndex > -1) {
                cart.products.splice(productIndex, 1);
                await cart.save();
            }
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }

    async incrementQuantity(req, res, next) {
        try {
            const userid = req.user;
            const user = await User.findOne({ login: userid });
            const cart = await Cart.findOne({ userId: user._id });
            const id = req.params.productId;
            const productIndex = cart.products.findIndex((p) => p.productId == id);

            if (productIndex > -1) {
                const product = cart.products[productIndex];
                product.quantity += 1;
                await cart.save();
            }
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }

    async decrementQuantity(req, res, next) {
        try {
            const userid = req.user;
            const user = await User.findOne({ login: userid });
            const cart = await Cart.findOne({ userId: user._id });
            const id = req.params.productId;
            const productIndex = cart.products.findIndex((p) => p.productId == id);

            if (productIndex > -1) {
                const product = cart.products[productIndex];
                if (product.quantity > 1) {
                    product.quantity -= 1;
                    await cart.save();
                }
            }
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }

    async orderCart(req, res, next) {
        try {
            const userid = req.user;
            const user = await User.findOne({ login: userid });
            const cart = await Cart.findOne({ userId: user._id });
            const order = await Orders.findOne({ userId: user._id });

            if (cart.products != undefined && cart.products.length > 0) {
                if (order) {
                    order.orders.push(cart.products)
                    await order.save();
                } else {
                    const newOrder = {
                        userId: user._id,
                        orders: [cart.products]
                    }
                    const newOrderInstance = new Orders(newOrder);
                    await newOrderInstance.save();
                }
                cart.products = [];
                await cart.save();
            }
            res.redirect('back');
        } catch (err) {
            next(err);
        }

    }
}

module.exports = CartController;