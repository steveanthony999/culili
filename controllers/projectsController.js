const asyncHandler = require('express-async-handler');
const fs = require('fs').promises;
const fsBase = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const User = require('../models/userModel');
const Project = require('../models/projectModel');

const isValidGitUrl = (url) => {
  const gitUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/[\w\-\.]+\.git$/; // Adjust regex as needed
  return gitUrlPattern.test(url);
};

const sanitizeUrl = (url) => {
  const sanitizedUrl = url.replace(/[^a-zA-Z0-9\-\/\:\.]+/g, '');
  return sanitizedUrl;
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

    const sanitizedUrl = sanitizeUrl(repositoryUrl);
    if (!isValidGitUrl(sanitizedUrl)) {
      res.status(400).json({ error: 'Invalid repository URL' });
      return;
    }

    const gitCloneCommand = `git clone ${sanitizedUrl} ${projectDirectory}`;
    execSync(gitCloneCommand);

    const packageJsonPath = path.join(projectDirectory, 'package.json');

    if (fsBase.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

      if (packageJson.scripts && packageJson.scripts.build) {
        const buildCommand = `cd ${projectDirectory} && npm install && npm run build`;
        execSync(buildCommand);
      } else {
        console.error('Build script not found in package.json');
        res.status(400).json({ error: 'Build script not found in package.json' });
        return;
      }
    } else {
      console.error('package.json not found');
      res.status(400).json({ error: 'package.json not found in the cloned repository' });
      return;
    }
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
