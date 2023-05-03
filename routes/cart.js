var express = require('express');
var router = express.Router();
var authorizeModule = require('../authorize');
var User = require("../models/user");
var cartController = require("../controllers/cartController");
var authorize = authorizeModule.authorize;


router.get('/order', authorize(), cartController.orderCart);
router.get('/:productId', authorize(), cartController.addItemToCart);
router.get('/delete/:productId', authorize(), cartController.removeItem);
router.get('/increment/:productId', authorize(), cartController.incrementQuantity);
router.get('/decrement/:productId', authorize(), cartController.decrementQuantity);
router.get('/', authorize(),  cartController.showCart);

module.exports = router;