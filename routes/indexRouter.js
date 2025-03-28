const express = require('express');
const indexRouter = express.Router();
const path = require('path');

indexRouter.get('/', (req, res) => {
  if (req.query.format === 'json') {
    res.json({ message: 'Welcome to My Node.js Portfolio!' });
  } else {
    res.render('index', {
      title: 'Welcome to My Node.js Portfolio',
    });
  }
});

indexRouter.get('/about', (req, res) => {
  if (req.query.format === 'json') {
    res.json({
      name: 'Your Name',
      bio: 'Web developer specializing in backend engineering.',
    });
  } else {
    res.render('about', {
      title: 'About Me',
    });
  }
});

module.exports = indexRouter;
