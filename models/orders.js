var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//blueprint for database products/elements
var schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orders: {type: Array, required: true}
});

//export model with specified name for it and what should it be based on
module.exports = mongoose.model('Orders', schema);