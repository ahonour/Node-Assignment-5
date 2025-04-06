const express = require('express');
const contactRouter = express.Router();
const Contact = require('../models/Contact');

// Middleware to parse URL-encoded data
contactRouter.use(express.urlencoded({ extended: true }));

// Render contact form
contactRouter.get('/', (req, res) => {
  res.render('contact', { submitted: false });
});

// Handle contact form submission
contactRouter.post('/submit', async (req, res) => {
  try {
    const { userName, userMessage } = req.body;
    const newContact = new Contact({ user: userName, message: userMessage });
    await newContact.save();
    res.render('contact', { submitted: true });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).send('An error occurred while submitting your message.');
  }
});

module.exports = contactRouter;
