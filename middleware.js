module.exports.isLoggedIn = (req, res, next) => {
      if (!req.isAuthenticated()) {
            req.flash('error', 'you must be logged in');
            res.redirect('/login');
      } else {
            next();
      }
};

module.exports.appError = (req, res, next) => {

};