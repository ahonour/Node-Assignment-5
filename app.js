'use strict';

const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local');

const hostname = '127.0.0.1';
const port = process.env.port || 3000;

const uri = process.env.MONGO_URI;

const indexRouter = require('./routes/indexRouter');
const contactRouter = require('./routes/contactRouter');
const projectRouter = require('./routes/projectRouter');
const errorRouter = require('./routes/errorRouter');

// Database setup
const { mongoose } = require('mongoose');
mongoose.connect(uri);
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

// Local variables
app.locals.title = 'EJS yourself';
app.locals.navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Projects', path: '/projects' },
];

// Routes
app.use('/contact', contactRouter);
app.use('/projects', projectRouter);
app.use('/', indexRouter);
app.use('/*', errorRouter);

// Start server
app.listen(port, () =>
  console.log(`Server is running on http://${hostname}:${port} !`)
);
