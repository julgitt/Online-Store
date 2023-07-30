const express = require('express');
const router = express.Router();
const authorizeModule = require('../authorize');
const CartController = require("../controllers/cartController");
const cartCtrl = new CartController();
const authorize = authorizeModule.authorize;

router.post('/order', authorize(), cartCtrl.orderCart);
router.post('/:productId', authorize(), cartCtrl.addItemToCart);
router.delete('/delete/:productId', authorize(), cartCtrl.removeItem);
router.post('/increment/:productId', authorize(), cartCtrl.incrementQuantity);
router.post('/decrement/:productId', authorize(), cartCtrl.decrementQuantity);
router.post('/', authorize(), cartCtrl.showCart);

module.exports = router;