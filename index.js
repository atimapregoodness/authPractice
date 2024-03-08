const express = require('express');
const User = require('./models/user');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');    //requiring passport (1)
const LocalStrategy = require('passport-local'); // requiring passport-local (2)
const { isLoggedIn } = require('./middleware');
const appError = require('./utils/appError');


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

mongoose.connect('mongodb://127.0.0.1:27017/passportAuth', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
            console.log("CONNECTION SUCCEEDED ");
      }).catch(err => {
            console.log(`CONNECTION FAILED`);
            console.log(err);
      });


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


app.get('/acct', isLoggedIn, async (req, res) => {
      res.render('acct');
});
app.get('/signup', (req, res) => {
      res.render('signup');
});

app.get('/logout', (req, res, next) => {
      req.logOut(function (err) {
            return next(err);
      });
      req.flash('logoutMsg', 'successfully logout');
      res.redirect('/login');
});

app.post('/signup', async (req, res) => {
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
});

app.get('/login', (req, res) => {
      if (!req.user) {
            res.render('login');
      } else {
            res.redirect('/acct');
      }
});

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
      res.redirect(`/acct`);
});

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