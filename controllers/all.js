module.exports.loginPg = (req, res) => {
    if (!req.user) {
        res.render('login');
    } else {
        res.redirect('/acct');
    }
};