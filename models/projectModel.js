const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    projectName: {
      type: String,
      required: [true, 'Please add a project name'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    repositoryUrl: {
      type: String,
      required: [true, 'Please add a repository URL'],
    },
    buildStatus: {
      type: String,
      enum: ['pending', 'success', 'error'],
      default: 'pending',
    },
    deploymentLog: {
      type: String,
    },
    projectDirectory: {
      type: String,
      required: [true, 'Project directory path is required'],
    },
    domain: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
