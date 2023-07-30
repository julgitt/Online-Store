const User = require("../models/user");

class UserRepository {

  constructor() { }

  // get user from database
  async getUser(login = null, email = null) {
    try {
      const search = login
        ? await User.find({ login: login }).exec()
        : await User.find({ email: email }).exec();

      return search;
    } catch (err) {
      throw err;
    }
  }

  async insertUser(newUser) {
    if (!newUser) return;
    try {
      const result = await User.insertMany(newUser);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserRepository;
