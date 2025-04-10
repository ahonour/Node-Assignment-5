const User = require('../models/User');
const passport = require('passport');
const RequestService = require('../services/RequestService');
const UserData = require('../data/UserData');
const _userData = new UserData();

// Displays registration form.
exports.Register = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  res.render('user/register', { errorMessage: '', user: {}, reqInfo: reqInfo });
};
// Handles 'POST' with registration form submission.
exports.RegisterUser = async function (req, res) {
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  if (password == passwordConfirm) {
    // Creates user object with mongoose model.
    // Note that the password is not present.
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
    });
    // Uses passport to register the user.
    // Pass in user object without password
    // and password as next parameter.
    User.register(
      new User(newUser),
      req.body.password,
      function (err, account) {
        // Show registration form with errors if fail.
        if (err) {
          let reqInfo = RequestService.reqHelper(req);
          return res.render('user/register', {
            user: newUser,
            errorMessage: err,
            reqInfo: reqInfo,
          });
        }
        // User registration was successful, so let's immediately authenticate and redirect to home page.
        passport.authenticate('local')(req, res, function () {
          res.redirect('/');
        });
      }
    );
  } else {
    let reqInfo = RequestService.reqHelper(req);
    res.render('user/register', {
      user: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
      },
      errorMessage: 'Passwords do not match.',
      reqInfo: reqInfo,
    });
  }
};

// Show login form.
exports.Login = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  let errorMessage = req.query.errorMessage;
  res.render('user/login', {
    user: {},
    errorMessage: errorMessage,
    reqInfo: reqInfo,
  });
};
// Receive login information, authenticate, and redirect depending on pass or fail.
// exports.LoginUser = (req, res, next) => {
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/user/login?errorMessage=Invalid login.',
//   })(req, res, next);
// };
exports.LoginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/user/login?errorMessage=Invalid login.');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Set roles in the session
      req.session.roles = user.roles || [];
      return res.redirect('/');
    });
  })(req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
  // Use Passports logout function
  req.logout((err) => {
    if (err) {
      console.log('logout error');
      return next(err);
    } else {
      // logged out. Update the reqInfo and redirect to the login page
      let reqInfo = RequestService.reqHelper(req);
      res.render('user/login', {
        user: {},
        isLoggedIn: false,
        errorMessage: '',
        reqInfo: reqInfo,
      });
    }
  });
};
