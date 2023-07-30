const express = require('express');
const router = express.Router();
const authorizeModule = require('../authorize');
const CartController = require("../controllers/cartController");
const cartCtrl = new CartController();
const authorize = authorizeModule.authorize;

router.get('/order', authorize(), cartCtrl.orderCart);
router.get('/:productId', authorize(), cartCtrl.addItemToCart);
router.delete('/delete/:productId', authorize(), cartCtrl.removeItem);
router.get('/increment/:productId', authorize(), cartCtrl.incrementQuantity);
router.get('/decrement/:productId', authorize(), cartCtrl.decrementQuantity);
router.get('/', authorize(), cartCtrl.showCart);

module.exports = router;