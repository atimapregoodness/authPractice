const express = require('express');
const User = require('./models/user');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const allCtl = require('./controllers/all');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');    //requiring passport (1)
const LocalStrategy = require('passport-local'); // requiring passport-local (2)
const { isLoggedIn } = require('./middleware');
const appError = require('./utils/appError');


mongoose.connect('mongodb://127.0.0.1:27017/passportAuth', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
            console.log("CONNECTION SUCCEEDED ");
      }).catch(err => {
            console.log(`CONNECTION FAILED`);
            console.log(err);
      });

const configSession = {
      secret: 'ohboythisismysecret',
      resave: false,
      saveUninitialized: true,
      cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 24 * 7
      }
};

app.use(session(configSession));

app.use(passport.initialize()); //initialing passport  (3)
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(flash());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      res.locals.success = req.flash('success');
      res.locals.incorrect = req.flash('incorrect');
      res.locals.error = req.flash('error');
      next();
});


app.get('/acct', isLoggedIn, allCtl.renderAcct);

app.get('/signup', allCtl.renderSignup);

app.post('/signup', allCtl.createAcct);

app.get('/logout', allCtl.logout);

app.get('/login', allCtl.loginPg);

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), allCtl.login);

app.all('*', (req, res, next) => {
      next(new appError('Page not found', 404));
});

app.use((err, req, res, next) => {
      const { status = 500 } = err;
      if (!err.message) {
            err.message = 'something went wrong';
      }
      res.status(status).render('error/errorPage', { err });
});

app.listen(3000, () => {
      console.log('listening to port:3000');
});