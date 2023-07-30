const UserRepository = require('../repository/userRepository.js');
const bcrypt = require('bcrypt');
const repo = new UserRepository;

class UserController {

    constructor() { }

    async getUser(login = null, email = null, password) {
        var items;
        if (login)
            items = await repo.getUser(login, null);
        if (items.length == 0 && email)
            items = await repo.getUser(null, email);

        if (items.length != 0) {
            return await bcrypt.compare(password, items[0].password);
        }
        return false;
    }

    async getEmail(email) {
        var items = await repo.getUser(null, email);
        return items.length !== 0;
    }

    async getLogin(login) {
        var items = await repo.getUser(login);
        return items.length !== 0;
    }

    async getRoles(login) {
        var items = await repo.getUser(login);
        if (items.length == 0) {
            items = await repo.getUser(null, login);
        }

        if (items.length != 0) {
            return items[0].roles;
        }
        return [];
    }

    async doInsertUser(login, email, password) {
        try {
            const id = new Date().getTime();

            // create and validate model
            const user = {
                userId: id,
                login: login,
                email: email,
                password: await bcrypt.hash(password, 12),
                roles: ['logged'],
            };

            const repo = new userRepository();
            // save user in the repository
            const result = await repo.insertUser(user);
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = UserController;
