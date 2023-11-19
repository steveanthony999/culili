const asyncHandler = require('express-async-handler');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const User = require('../models/userModel');
const Project = require('../models/projectModel');

const isValidGitUrl = (url) => {
  const gitUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/[\w\-\.]+\.git$/; // Adjust regex as needed
  return gitUrlPattern.test(url);
};

// =============================================================================
// @desc    Create a New Project
// @route   POST /api/projects
// @access  Private
// =============================================================================
const createProject = asyncHandler(async (req, res) => {
  const { projectName, description, repositoryUrl } = req.body;

  if (!projectName || !description || !repositoryUrl) {
    res.status(400);

    throw new Error('Please add a Project Name, description, and repository URL');
  }

  if (!isValidGitUrl(repositoryUrl)) {
    res.status(400);
    throw new Error('Invalid repository URL');
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

    const gitCloneCommand = `git clone ${repositoryUrl} ${projectDirectory}`;
    execSync(gitCloneCommand);
  } catch (error) {
    console.error('Error creating project directory:', error);
    res.status(500);
    throw new Error('Server error occurred while creating project space');
  }

  const project = await Project.create({
    userId: req.user.id,
    projectName,
    description,
    repositoryUrl,
    projectDirectory,
    buildStatus: 'pending',
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
