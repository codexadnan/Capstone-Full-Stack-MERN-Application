import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

// Authentication middleware: verifies the JWT and attaches the user to req.user
const protect = async (req, res, next) => {
  let token = req.cookies?.token;

  // Optional fallback: Authorization: Bearer <token> (useful for Postman)
  const header = req.headers.authorization;
  if (!token && header?.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authenticated. Please log in.', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET); // errors handled centrally
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError('The account for this session no longer exists.', 401);
  }

  req.user = user;
  next();
};

export default protect;
