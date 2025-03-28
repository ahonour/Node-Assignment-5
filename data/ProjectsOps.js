const Projects = require('../models/Projects.js');

class ProjectsOps {
  // empty constructor
  ProjectsOps() {}
  //   constructor() {}

  // DB methods
  async getAllProjects() {
    console.log('getting all projects');
    let projects = await Projects.find({});
    console.log(`these are the projects: ${projects}`);
    return projects;
  }
  // async getProjectById(id) {
  //   console.log(`getting project by id ${id}`);
  //   let project = await Projects.findOne({ id: Number(id) });
  //   console.log(project);
  //   return project;
  // }
  async getProjectById(id) {
    let project = await Projects.findById(id);
    console.log(`project by id is ${project}`);
    return project;
  }
  async getProjectBySearchTerm(searchTerm) {
    console.log(`getting project by search term ${searchTerm}`);

    let searchRegex = new RegExp(searchTerm, 'i');

    // Search in title, summary, and tech
    let projects = await Projects.find({
      $or: [
        { title: { $regex: searchRegex } },
        { summary: { $regex: searchRegex } },
        { tech: { $elemMatch: { $regex: searchRegex } } },
      ],
    });

    return projects;
  }

  async deleteProject(id) {
    let project = await Projects.findOneAndDelete({ _id: id });
    console.log(`Tried to delete ${project}`);
    return project;
  }

  // async createProject(project) {
  //   console.log('creating project');
  //   let newProject = new Projects(project);
  //   await newProject.save();
  //   return newProject;
  // }

  async createProject(project) {
    console.log('creating project');
    let newProject = await Projects.insertOne(project);
    console.log(`new project is ${newProject}`);
    return newProject;
  }

  // async updateProject(project) {
  //   console.log(`updating project ${project}`);
  //   let updatedProject = await Projects.findOneAndUpdate(
  //     { _id: project._id },
  //     project,
  //     { new: true }
  //   );
  //   return updatedProject;
  // }
  async updateProject(project) {
    try {
      const { _id, ...projectData } = project;
      let updatedProject = await Projects.findByIdAndUpdate(_id, projectData, {
        new: true,
      });
      console.log(`updated project ${updatedProject}`);
      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err; // Or handle the error as appropriate
    }
  }
}

module.exports = ProjectsOps;
