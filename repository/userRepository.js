var express = require('express');
var User = require("../models/user");
 
class userRepository {
    constructor() { }

    // get user from database
    async getUser (login = null, email = null) {
        try {
            var search;
            if (login) 
                search = await User.find({login: login}).exec();
            else if (email) 
                search = await User.find({email: email}).exec();
            
            return Promise.resolve(search);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async insertUser(newUser) {
        if (!newUser) return;
        try {
            newUser = await User.insertMany(newUser);
            return Promise.resolve(newUser);
        } catch(err) {
            return Promise.reject(err);
        }
    }
}


module.exports = userRepository;
