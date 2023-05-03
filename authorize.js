var userController = require('./controllers/userController');
var userCtrl =  new userController();

/**
* Check if the user has a role with the given name.
*/

async function isUserInRole(user, role) {
    // here we need to compare with what is in the database
    var result = JSON.stringify(await userCtrl.getRoles(user)).includes(role);
    return result;
}


function authorize(...roles) {
    return  async function(req, res, next) {
        if ( req.signedCookies.user ) {
            let user = req.signedCookies.user;
            if ( roles.length == 0) {
                req.user = user;
                return next();
            }
            await Promise.all(roles.map(async (role) => {
                if (await isUserInRole( user, role ))
                    req.user = user;
            }))
            if ( req.user )
                return next();
        }
        // home page case
        if(roles.length == 0){
            req.user = undefined;
            return next();
        }
        // if there is no user cookie, redirect to login page
        res.redirect('/login?returnUrl='+req.url);
    }
}

module.exports = {
    authorize: authorize,
    isUserInRole: isUserInRole,
};