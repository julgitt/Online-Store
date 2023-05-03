var mongoose = require('mongoose');
var User = require("../models/user");
var Schema = mongoose.Schema;

//blueprint for database products/elements
var schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    products: [
        {
          productId: Number,
          quantity: Number,
          name: String,
          price: Number,
          image: String,
        }
      ]
});

//export model with specified name for it and what should it be based on
module.exports = mongoose.model('Cart', schema);