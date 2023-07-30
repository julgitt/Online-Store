const UserController = require('./controllers/userController');

/**
 * Check if the user has a role with the given name.
 */
async function isUserInRole(user, role) {
    const userCtrl = new UserController;
    return JSON.stringify(await userCtrl.getRoles(user)).includes(role);
}

function authorize(...roles) {
    return async function (req, res, next) {
        if (req.signedCookies.user) {
            const user = req.signedCookies.user;
            if (roles.length === 0) {
                req.user = user;
                return next();
            }
            const isInRoles = await Promise.all(roles.map((role) => isUserInRole(user, role)));
            if (isInRoles.some((result) => result)) {
                req.user = user;
                return next();
            }
        }
        // Home page case
        if (roles.length === 0) {
            req.user = undefined;
            return next();
        }
        // If there is no user cookie, redirect to the login page
        res.redirect('/login?returnUrl=' + req.url);
    };
}

module.exports = {
    authorize,
    isUserInRole,
};