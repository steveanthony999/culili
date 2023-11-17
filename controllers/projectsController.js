const asyncHandler = require('express-async-handler');
const fs = require('fs').promises;
const path = require('path');

const User = require('../models/userModel');
const Project = require('../models/projectModel');

// =============================================================================
// @desc    Create a New Project
// @route   POST /api/projects
// @access  Private
// =============================================================================
const createProject = asyncHandler(async (req, res) => {
  const { projectName, description } = req.body;

  if (!projectName || !description) {
    res.status(400);

    throw new Error('Please add a Project Name and description');
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);

    throw new Error('User not found');
  }

  const userProjectsBaseDir = path.join(__dirname, '..', 'user_projects');
  const projectDirectory = path.join(userProjectsBaseDir, projectName);
  try {
    await fs.mkdir(projectDirectory, { recursive: true });
  } catch (error) {
    console.error('Error creating project directory:', error);
    res.status(500);
    throw new Error('Server error occurred while creating project space');
  }

  const project = await Project.create({
    projectName,
    description,
    userId: req.user.id,
    directory: projectDirectory
  });

  user.numProjects += 1;
  await user.save();

  res.status(201).json({
    project,
    message: `Project created successfully. Access your project at ${projectDirectory}`
  });
});

module.exports = {
  createProject,
};
