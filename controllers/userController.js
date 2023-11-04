const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const resend = require('../utils/resend');

const User = require('../models/userModel');

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  let hashedPassword;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (user) {
    try {
      await sendVerificationEmail(user);
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
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
        <a href="http://localhost:5000/api/users/verify-email?token=${verificationToken}">Verify Email</a>
      `,
    });
  } catch (error) {
    throw new Error('Failed to send verification email');
  }
});

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

    res.redirect('http://localhost:5173/email-verified');
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid token' });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      image: user.image,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('invalid credentials');
  }
});

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
};
