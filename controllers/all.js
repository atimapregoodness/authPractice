const User = require('../models/user');

module.exports.loginPg = (req, res) => {
    if (!req.user) {
        res.render('login');
    } else {
        res.redirect('/acct');
    }
};

module.exports.renderAcct = async (req, res) => {
    res.render('acct');
};

module.exports.renderSignup = (req, res) => {
    res.render('signup');
};

module.exports.logout = (req, res, next) => {
    req.logOut(function (err) {
        return next(err);
    });
    req.flash('logoutMsg', 'successfully logout');
    res.redirect('/login');
};

module.exports.createAcct = async (req, res) => {
    if (req.user) {
        res.redirect('/acct');
    }
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        res.redirect('/login');

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};