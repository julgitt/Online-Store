const Product = require("../models/product");

class ProductController {

    constructor() { }

    async insertProduct(name, price, image) {
        try {
            const id = new Date().getTime();

            // create and validate model
            const product = {
                productId: id,
                imagePath: image,
                productName: name,
                price: price,
            };
            
            return await Product.insertMany(product);
        } catch (err) {
            return err;
        }
    }

    async removeItem(req, res, next) {
        const id = req.params.productId;
        await Product.deleteOne({ productId: id });

        res.redirect('back');
    }
}
module.exports = ProductController;

