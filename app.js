'use strict';

const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();
const cors = require('cors');
const { mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const RequestService = require('./services/RequestService');

const hostname = '127.0.0.1';
const port = process.env.port || 3000;

const uri = process.env.MONGO_URI;

// Connect to the database
mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Set up view engine and layouts
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', './layouts/default');

// Middleware
app.use(cors({ origin: [/127.0.0.1*/, /localhost*/] }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(expressLayouts);

// Parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up session management
app.use(
  require('express-session')({
    secret: `shhhhh, it's so secret`,
    resave: false,
    saveUninitialized: false,
  })
);

// User Auth
app.use(passport.initialize());
app.use(passport.session());
const User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make reqInfo available to all views
app.use((req, res, next) => {
  res.locals.reqInfo = RequestService.reqHelper(req);
  next();
});

// Local variables
app.locals.title = 'EJS yourself';
app.locals.navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Projects', path: '/projects' },
];

// Routes
const indexRouter = require('./routes/indexRouter');
const contactRouter = require('./routes/contactRouter');
const projectRouter = require('./routes/projectRouter');
const errorRouter = require('./routes/errorRouter');
const userRouter = require('./routes/userRouter');

app.use('/user', userRouter);
app.use('/contact', contactRouter);
app.use('/projects', projectRouter);
app.use('/', indexRouter);
app.use('/*', errorRouter);

// Start server
app.listen(port, () =>
  console.log(`Server is running on http://${hostname}:${port} !`)
);
