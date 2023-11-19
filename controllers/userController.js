const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const resend = require('../utils/resend');

const User = require('../models/userModel');

const isProduction = process.env.NODE_ENV === 'production';
const verifyEmailUrl = isProduction ? '<a href="https://api.culili.com/api/users/verify-email?token=${verificationToken}">Verify Email</a>' : '<a href="http://localhost:5001/api/users/verify-email?token=${verificationToken}">Verify Email</a>';
const emailVerifiedUrl = isProduction ? 'https://app.culili.com/email-verified' : 'http://localhost:5173/email-verified';

// Register
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;

  console.log(req.body)

  if (!firstName || !lastName || !email) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
  });

  if (user) {
    try {
      sendVerificationEmail(user);
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
        numProjects: user.numProjects,
        token: generateToken(user._id),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Send Verification Email
const sendVerificationEmail = asyncHandler(async (user, res) => {
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const verificationToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  try {
    await resend.emails.send({
      from: 'Culili <no-reply@culili.com>',
      to: [user.email],
      subject: 'Verify your email for Culili',
      html: `
        <strong>Email Verification</strong>
        <p>Please click the link below to verify your email:</p>
        ${verifyEmailUrl}
      `,
    });
  } catch (error) {
    throw new Error('Failed to send verification email');
  }
});

// Verify Email
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.email !== decoded.email) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    user.isVerified = true;
    await user.save();

    // res.redirect('http://localhost:5173/email-verified');
    res.redirect(emailVerifiedUrl);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid token' });
  }
});

// Log In
const login = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      numProjects: user.numProjects,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('invalid credentials');
  }
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    numProjects: req.user.numProjects,
    isVerified: req.user.isVerified,
  };

  res.status(200).json(user);
});

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  register,
  sendVerificationEmail,
  verifyEmail,
  login,
  getCurrentUser,
};
