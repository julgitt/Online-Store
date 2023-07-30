var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Product = require("../models/product");
var Orders = require("../models/orders");
var authorizeModule = require('../authorize');
var authorize = authorizeModule.authorize;
var ProductController = require("../controllers/productController");
var productCtrl = new ProductController();
const multer = require('multer');

const storage = multer.diskStorage(
    {
        destination: './public/img/products/',
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }
);

const upload = multer({ storage: storage });

router.get('/shop/delete/:productId', authorize('admin'), productCtrl.removeItem);

router.post('/addProduct', upload.single('image'), authorize('admin'), async (req, res) => {
    await productController.insertProduct(req.body.productName, req.body.price, "img/products/" + req.file?.filename);
    res.redirect('/admin_shop');
})

router.get('/admin_shop', authorize('admin'), async (req, res, next) => {
    const elements = await Product.find();
    res.render('admin_shop', { elem: elements, user: req.user });
})

router.get('/admin_dashboard', authorize('admin'), async (req, res, next) => {
    const elements = await User.find();
    const orders = await Orders.find();

    const userOrders = [];
    for (var i = 0; i < orders.length; i++) {
        var userOrder = await User.findOne({ _id: orders[i].userId });
        userOrders.push({ login: userOrder.login, order: orders[i].orders });
    }

    res.render('admin_dashboard', { elem: elements, orders: userOrders, user: req.user });
})

module.exports = router;

// add admin to the database - uncomment to call this function
// const insertAdmin = async () => {
//     try{
//         var pwd = 'password';
//         const docs = await User.insertMany({userId: 2, login: 'Admin', email: 'admin2@gmail.com', password: await bcrypt.hash( pwd, 12 ), roles: ['logged', 'admin']})
//         return Promise.resolve(docs);
//     } catch(err) {
//         return Promise.reject(err);
//     }
//   }
// insertAdmin().then((docs => console.log(docs))).catch((err) => console.log(err)); 