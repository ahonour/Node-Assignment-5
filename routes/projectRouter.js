const express = require('express');
const projectRouter = express.Router();
const path = require('path');
const projects = require('../public/data/projects.data.js');
const ProjectsController = require('../controllers/ProjectsController.js');

// const viewData = [];

projectRouter.get('/search', ProjectsController.Search);
projectRouter.get('/create', ProjectsController.Create);
projectRouter.post('/create', ProjectsController.CreateProject);
projectRouter.get('/', ProjectsController.Index);
projectRouter.get('/:id', ProjectsController.Detail);
projectRouter.get('/:id/delete', ProjectsController.Delete);
projectRouter.get('/:id/edit', ProjectsController.Edit);
projectRouter.post('/:id/edit', ProjectsController.Update);

module.exports = projectRouter;
