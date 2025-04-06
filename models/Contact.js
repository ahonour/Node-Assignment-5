const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    user: { type: 'String', required: true },
    message: { type: 'String', required: true },
  },
  { collection: 'contact' }
);

// Pass the Schema into Mongoose to use as our model
const Contact = mongoose.model('Contact', contactSchema);

// Export it so that we can use this model in our App
module.exports = Contact;
