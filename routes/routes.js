var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Product = require("../models/product");
var Cart = require("../models/cart");
var Orders = require("../models/orders");
var authorizeModule = require('../authorize');
var authorize = authorizeModule.authorize;
var productController = require("../controllers/productController");
const multer = require('multer');
const cart = require('../models/cart');
const user = require('../models/user');
const storage = multer.diskStorage(
    {
        destination: './public/img/products/',
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            cb( null, file.originalname);
        }
    }
);

const upload = multer({storage: storage});


router.get('/', authorize(), async function (req, res, next){
    const elements = await Product.find();
    res.render('index', {elem: elements, user: req.user});
})

router.get('/shop', authorize(), async function (req, res, next){
    const elements = await Product.find();
    res.render('shop', {elem: elements, user: req.user});
})

router.get('/shop/delete/:productId', authorize('admin'), productController.removeItem);

router.post('/addProduct', upload.single('image'), authorize('admin'), async (req, res) => {
    await productController.insertProduct(req.body.productName, req.body.price, "img/products/" + req.file?.filename);
    res.redirect('/admin_shop');
})

router.get('/admin_shop', authorize('admin'), async function (req, res, next){
    const elements = await Product.find();
    res.render('admin_shop', {elem: elements, user: req.user});
})

router.get('/admin_dashboard', authorize('admin'), async function (req, res, next){
    const elements = await User.find();
    const orders = await Orders.find();

    const userOrders = [];
    for(var i = 0; i < orders.length; i++){
        var userOrder = await User.findOne({_id: orders[i].userId});
        userOrders.push({login: userOrder.login, order: orders[i].orders});
    }

    res.render('admin_dashboard', {elem: elements, orders: userOrders, user: req.user});
})

//add products to database - uncomment to call this function
/*    const insertProducts = async () => {
     try{
         const docs = await Product.insertMany(Products)
         return Promise.resolve(docs);
     }catch(err){
         return Promise.reject(err)
     }
 }
 insertProducts().then((docs => console.log(docs))).catch((err) => console.log(err));  */


module.exports = router;
