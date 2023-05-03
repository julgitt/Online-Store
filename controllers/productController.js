const Product = require("../models/product");

exports.insertProduct = async function (name, price, image){
    try{
        const id = new Date().getTime();
       
        // create and validate model
        const product = {
            productId: id,
            imagePath: image,
            productName: name,
            price: price,
        };

        // save user in the repository
        var result = await Product.insertMany(product);
        return Promise.resolve(result);
    } catch(err){
        return Promise.reject(err);
    }
}

exports.removeItem = async function(req, res, next){
    var id = req.params.productId;
    await Product.deleteOne({productId: id});

    res.redirect('back');
}

