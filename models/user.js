var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//blueprint for database products/elements
var schema = new Schema({
    userId: {type: Number, required: true},
    login: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    roles: {type: Array, required: true}
});

//export model with specified name for it and what should it be based on
module.exports = mongoose.model('User', schema);