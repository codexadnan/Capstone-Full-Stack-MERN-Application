import { validationResult } from 'express-validator';

// Runs after express-validator rules; returns 400 with readable messages
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return res.status(400).json({
    success: false,
    message: errors[0].message,
    errors,
  });
};

export default validate;
