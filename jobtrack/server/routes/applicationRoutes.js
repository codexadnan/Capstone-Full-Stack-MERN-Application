import { Router } from 'express';
import {
  getApplications, getStats, getApplication,
  createApplication, updateApplication, deleteApplication,
} from '../controllers/applicationController.js';
import protect from '../middleware/protect.js';
import validate from '../middleware/validate.js';
import { applicationRules, idRule } from '../validators/applicationValidators.js';

const router = Router();

// Every route below requires a logged-in user
router.use(protect);

router.route('/')
  .get(getApplications)
  .post(applicationRules, validate, createApplication);

// Must be declared BEFORE '/:id', otherwise "stats" would be read as an id
router.get('/stats', getStats);

router.route('/:id')
  .get(idRule, validate, getApplication)
  .put(idRule, applicationRules, validate, updateApplication)
  .delete(idRule, validate, deleteApplication);

export default router;
