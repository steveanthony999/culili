const asyncHandler = require('express-async-handler');

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

  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);

    throw new Error('User not found');
  }

  const project = await Project.create({
    projectName,
    description,
    userId: req.user.id,
  });

  user.numProjects += 1;
  await user.save();

  res.status(201).json(project);
});

module.exports = {
  createProject,
};
