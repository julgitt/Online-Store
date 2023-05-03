//const bcrypt = require('bcrypt');
const userRepository = require('../repository/userRepository.js');
const bcrypt = require('bcrypt');

class userController {

    constructor() { }

    async getUser(login = null, email = null, password) {

        const repo = new userRepository();
        var items;
        if (login)
            items = await repo.getUser(login, null);
        if (items.length == 0 && email)
            items = await repo.getUser(null, email);
        
        
        if (items.length != 0){
            return await bcrypt.compare(password, items[0].password);
        }
        return false;
    }   
    
    async getEmail(email) {

        const repo = new userRepository();

        var items = await repo.getUser(null, email);
              
        if (items.length != 0){
            return true;
        }
        return false;
    } 

    async getLogin(login) {

        const repo = new userRepository();

        var items = await repo.getUser(login);
              
        if (items.length != 0){
            return true;
        }
        return false;
    }

    async getRoles(login) {

        const repo = new userRepository();
        var items = await repo.getUser(login);
        if (items.length == 0){
            items = await repo.getUser(null, login);
        }
              
        if (items.length != 0){
            return items[0].roles;
        }
        return [];
    } 

    async doInsertUser(login, email, password) {
        //const userData = req.body;
        try{
            const id = new Date().getTime();

            // create and validate model
            const user = {
                userId: id,
                login: login,
                email: email,
                password: await bcrypt.hash( password, 12 ),
                roles: ['logged'],
            };

            const repo = new userRepository();

            // save user in the repository
            var result = await repo.insertUser(user);
            return Promise.resolve(result);
        } catch(err){
            return Promise.reject(err);
        }
    }
}

module.exports = userController;
