const ProjectsOps = require('../data/ProjectsOps.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    // Get original extension
    const ext = path.extname(file.originalname);

    cb(null, Date.now() + '-' + file.originalname);
  },
});

const _projectsOps = new ProjectsOps();

const upload = multer({ storage: storage });

exports.Index = async function (request, response) {
  let projects = await _projectsOps.getAllProjects();
  if (projects) {
    if (request.query.format === 'json') {
      response.json(projects);
      return;
    }
    response.render('projects', {
      title: 'Projects',
      projects: projects,
    });
  } else {
    response.render('projects', {
      title: 'Projects',
      projects: [],
    });
  }
};

exports.Detail = async function (request, response) {
  const projectId = request.params.id;
  console.log(`loading single project by id ${projectId}`);
  let project = await _projectsOps.getProjectById(projectId);
  if (project) {
    if (request.query.format === 'json') {
      response.json(project);
      return;
    }
    response.render('project-details', {
      title: 'Project - ' + project.title,
      project: project,
    });
  } else {
    response.render('error', {
      title: '404',
      projects: [],
    });
  }
};

exports.Search = async function (request, response) {
  console.log('searching projects from controller');
  const searchTerm = request.query.searchTerm;
  console.log('querystring', searchTerm);
  let projects = await _projectsOps.getProjectBySearchTerm(searchTerm);
  if (projects) {
    if (request.query.format === 'json') {
      response.json(projects);
      return;
    }
    response.render('projects', {
      title: 'Projects',
      projects: projects,
    });
  } else {
    response.render('projects', {
      title: 'Projects',
      projects: [],
    });
  }
};

exports.Delete = async function (request, response) {
  const projectId = request.params.id;
  let delProject = await _projectsOps.deleteProject(projectId);
  if (delProject) {
    console.log(`successfully deleted ${delProject} (probably)`);
    let projects = await _projectsOps.getAllProjects();
    const filePath = path.join('public', delProject.screenshot);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error removing file: ${err}`);
        return;
      }
      console.log(`File ${filePath} has been successfully removed.`);
    });
    response.render('projects', {
      title: 'Projects',
      projects: projects,
    });
  } else {
    console.log('Error, project not found');
    response.render('error');
  }
};

exports.Create = async function (request, response) {
  response.render('project-modify', {
    title: 'Add a Project',
    message: null,
    project: {},
  });
};

exports.CreateProject = [
  upload.single('projectImg'),
  async function (request, response) {
    let tech = request.body.tech.split(',').map((t) => t.trim());

    // Check if a file was uploaded
    let screenshotPath = request.file
      ? `/images/${request.file.filename}`
      : request.body.currentScreenshot;

    let tempProjectObj = {
      title: request.body.title,
      summary: request.body.summary,
      tech: tech,
      screenshot: screenshotPath,
    };
    console.log(tempProjectObj);

    let responseObj = await _projectsOps.createProject(tempProjectObj);

    if (responseObj) {
      let projects = await _projectsOps.getAllProjects();
      response.render('projects', {
        title: 'Projects',
        projects: projects,
      });
    } else {
      console.log('An error occurred. Item not created.');
      console.log(request.body);
      response.render('project-modify', {
        title: 'Add a Project',
        project: request.body,
        message: responseObj.errorMsg,
      });
    }
  },
];

exports.Edit = async function (request, response) {
  const projectId = request.params.id;
  console.log(`loading single project by id ${projectId}`);
  let project = await _projectsOps.getProjectById(projectId);
  if (project) {
    response.render('project-modify', {
      title: 'Edit Project',
      project: project,
      message: null,
    });
  } else {
    console.log('Error, project not found');
    response.render('error');
  }
};
exports.Update = [
  upload.single('projectImg'),
  async function (request, response) {
    let tech = request.body.tech.split(',').map((t) => t.trim());

    // Check if a file was uploaded
    let screenshotPath = request.file
      ? `/images/${request.file.filename}`
      : request.body.currentScreenshot;

    let tempProjectObj = {
      _id: request.body._id,
      title: request.body.title,
      summary: request.body.summary,
      tech: tech,
      screenshot: screenshotPath,
    };

    let responseObj = await _projectsOps.updateProject(tempProjectObj);

    if (responseObj) {
      if (request.file && request.body.currentScreenshot) {
        const oldFilePath = path.join('public', request.body.currentScreenshot);
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error(`Error removing old file: ${err}`);
            return;
          }
          console.log(`Old file ${oldFilePath} has been successfully removed.`);
        });
      }
      let projects = await _projectsOps.getAllProjects();
      response.render('projects', {
        title: 'Projects',
        projects: projects,
      });
    } else {
      console.log('An error occurred. Item not created.');
      console.log(request.body);
      response.render('project-modify', {
        title: 'Edit a Project',
        project: request.body,
        message: responseObj.errorMsg,
      });
    }
  },
];
