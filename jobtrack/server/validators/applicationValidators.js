import { body, param } from 'express-validator';
import { STATUSES, EMPLOYMENT_TYPES } from '../models/JobApplication.js';

export const idRule = [param('id').isMongoId().withMessage('Invalid application ID')];

// Same rules are used for create (POST) and update (PUT)
export const applicationRules = [
  body('company')
    .trim()
    .notEmpty().withMessage('Company is required')
    .isLength({ max: 100 }).withMessage('Company cannot be longer than 100 characters'),
  body('position')
    .trim()
    .notEmpty().withMessage('Position is required')
    .isLength({ max: 100 }).withMessage('Position cannot be longer than 100 characters'),
  body('location')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 100 }).withMessage('Location cannot be longer than 100 characters'),
  body('employmentType')
    .optional({ values: 'falsy' })
    .isIn(EMPLOYMENT_TYPES).withMessage('Invalid employment type'),
  body('jobUrl')
    .optional({ values: 'falsy' })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Job URL must be a valid link starting with http:// or https://'),
  body('salary')
    .optional({ values: 'falsy' })
    .isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
  body('status')
    .optional({ values: 'falsy' })
    .isIn(STATUSES).withMessage('Invalid status'),
  body('appliedDate')
    .optional({ values: 'falsy' })
    .isISO8601().withMessage('Applied date must be a valid date')
    .bail()
    .custom((value) => {
      const oneDayAhead = Date.now() + 24 * 60 * 60 * 1000; // timezone tolerance
      if (new Date(value).getTime() > oneDayAhead) {
        throw new Error('Applied date cannot be in the future');
      }
      return true;
    }),
  body('interviewDate')
    .optional({ values: 'falsy' })
    .isISO8601().withMessage('Interview date must be a valid date'),
  body('notes')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 }).withMessage('Notes cannot be longer than 2000 characters'),
];
