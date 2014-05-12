/**
 * Created by tomasj on 10/05/14.
 */

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user) {
        next();
    }
    else {
        res.send(401);
    }
}

function ensureUserIsAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.is_admin) {
        next();
    }
    else {
        res.send(401);
    }
}


module.exports.ensureAuth = ensureAuthenticated;
module.exports.ensureUserIsAdmin = ensureUserIsAdmin;