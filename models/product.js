var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//blueprint for database products/elements
var schema = new Schema({
    productId: {type: Number, required: true},
    imagePath: {type: String, required: true},
    productName: {type: String, required: true},
    price: {type: Number, required: true}
});

//export model with specified name for it and what should it be based on
module.exports = mongoose.model('Product', schema);