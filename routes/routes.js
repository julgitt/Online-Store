const express = require('express');
const router = express.Router();
const Product = require("../models/product");
const authorizeModule = require('../authorize');
const authorize = authorizeModule.authorize;

// home page
router.get('/', authorize(), async (req, res, next) => {
    const elements = await Product.find();
    res.render('index', { elem: elements, user: req.user });
})

// catalog
router.get('/shop', authorize(), async (req, res, next) => {
    const elements = await Product.find();
    res.render('shop', { elem: elements, user: req.user });
})

// search page
router.get('/search', authorize(), (req, res) => {
    res.render('search', { user: req.user });
});

// search bar
router.post('/getProducts', async (req, res) => {
    let payload = req.body.payload;
    let search = await Product.find({ productName: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
    res.send({ payload: search });
})

//add products to the database - uncomment to call this function
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