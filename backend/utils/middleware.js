/**
 * Created by tomasj on 10/05/14.
 */

function ensureAuthenticated(req, res, next) {
    console.log(req.user.id);
  if (req.isAuthenticated() && req.user.is_admin) {
      next();
  }
  else {
      res.send(401);
  }
}


module.exports.ensureAuth = ensureAuthenticated;