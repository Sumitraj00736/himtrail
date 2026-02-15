const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { signToken } = require('../utils/token');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Email already in use');
  }

  const user = await User.create({ name, email, password });
  const token = signToken(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN || '7d'
  );

  res.status(201).json({
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  const match = await user.matchPassword(password);
  if (!match) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  const token = signToken(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN || '7d'
  );

  res.json({
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
  });
});

module.exports = { register, login };
