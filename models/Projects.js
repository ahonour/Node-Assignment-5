const mongoose = require('mongoose');

const projectsSchema = mongoose.Schema(
  {
    title: { type: 'String', required: true },
    summary: { type: 'String', required: true },
    tech: { type: Array, required: true },
    screenshot: { type: 'String', required: true },
    // id: { type: Number, required: true },
  },

  { collection: 'projects' }
);

// Pass the Schema into Mongoose to use as our model
const Projects = mongoose.model('Projects', projectsSchema);

// Export it so that we can use this model in our App
module.exports = Projects;
