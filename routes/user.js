const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const userCtrl = new UserController();
const authorizeModule = require('../authorize');
const isUserInRole = authorizeModule.isUserInRole;

// after logout delete user cookie and redirect to home page
router.get('/logout', (req, res) => {
    res.cookie('user', '', { maxAge: -1 });
    res.redirect('/');
});

// login page
router.get('/login', (req, res) => {
    res.render('login');
});

// authentication
router.post('/login', async (req, res) => {
    var username = req.body.txtUser;
    var pwd = req.body.txtPwd;

    // here we need to compare with what is in the database
    if (await userCtrl.getUser(username, username, pwd)) {
        // create new cookie
        res.cookie('user', username, { signed: true });
        // redirect
        var returnUrl = req.query.returnUrl;

        // temporary method for redirecting to admin page after admin login
        if (await isUserInRole(username, 'admin')) {
            returnUrl = '/admin_dashboard';
        }

        if (returnUrl)
            res.redirect(returnUrl);
        else
            res.redirect('/');
    } else {
        res.render('login', { message: "Incorrect username/password combination." });
    }
});

// signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// post signup data and validation
router.post('/signup', async (req, res) => {
    var username = req.body.txtUser;
    var email = req.body.txtEmail;
    var pwd = req.body.txtPwd;
    var pwd_c = req.body.txtPwd_c;
    var message = "";

    // here we need to compare with what is in the database
    if (username == '' || email == '' || pwd == '' || pwd_c == '') {
        message = "Don't leave empty spaces!";
    } else if (await userCtrl.getLogin(username)) {
        message = "That username is already taken";
    } else if (await userCtrl.getEmail(email)) {
        message = "That email is already taken";
    } else if (pwd != pwd_c) {
        message = "Passwords do not match";
    } else {
        // here we will save data in the database
        await userCtrl.doInsertUser(username, email, pwd);
        return res.redirect('login');
    }
    res.render('signup', { message: message });
});

module.exports = router;
