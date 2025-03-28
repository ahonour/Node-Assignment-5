const express = require('express');
const contactRouter = express.Router();

// Middleware to parse URL-encoded data
contactRouter.use(express.urlencoded({ extended: true }));

contactRouter.get('/', (req, res) => {
  const viewData = {
    submitted: req.query.submitted === 'true',
  };
  if (req.query.format === 'json') {
    res.json({ success: true, message: 'Thank you for reaching out!' });
  } else {
    res.render('contact', viewData);
  }
});

contactRouter.post('/', (req, res) => {
  const { userName, userMessage } = req.body;
  if (userName && userMessage) {
    console.log(`User Name: ${userName}`);
    console.log(`User Message: ${userMessage}`);
    const viewData = {
      userName: userName,
      userMessage: userMessage,
      submitted: true,
    };
    res.render('contact', viewData);
  } else {
    console.log('Error submitting message');
    res.redirect('contact');
  }
});

module.exports = contactRouter;
