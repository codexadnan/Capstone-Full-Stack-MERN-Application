import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/token.js';

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  // Password is hashed by the User model's pre-save hook
  const user = await User.create({ name, email, password });

  setTokenCookie(res, generateToken(user._id));
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { user },
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // password is hidden by default, so we ask for it explicitly here
  const user = await User.findOne({ email }).select('+password');

  // Same message for "no user" and "wrong password" so attackers learn nothing
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  setTokenCookie(res, generateToken(user._id));
  res.json({
    success: true,
    message: 'Logged in successfully',
    data: { user },
  });
};

// POST /api/auth/logout
export const logout = (req, res) => {
  clearTokenCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
};

// GET /api/auth/me   (protected)
export const getMe = (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};
