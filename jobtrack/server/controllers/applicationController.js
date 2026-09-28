import mongoose from 'mongoose';
import JobApplication from '../models/JobApplication.js';
import AppError from '../utils/AppError.js';

const ALLOWED_FIELDS = [
  'company', 'position', 'location', 'employmentType', 'jobUrl',
  'salary', 'status', 'appliedDate', 'interviewDate', 'notes',
];

// Whitelist body fields so users can never set `user`, `_id`, timestamps, etc.
const pickApplicationData = (body) => {
  const data = {};
  ALLOWED_FIELDS.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });

  // Empty optional values -> proper "empty" values
  ['salary', 'appliedDate', 'interviewDate'].forEach((field) => {
    if (data[field] === '' || data[field] === undefined) delete data[field];
  });
  ['employmentType', 'status'].forEach((field) => {
    if (data[field] === '') delete data[field]; // fall back to schema default
  });
  if (body.salary === '' || body.salary === null) data.salary = null;
  if (body.interviewDate === '' || body.interviewDate === null) data.interviewDate = null;

  return data;
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORT_OPTIONS = {
  newest: { appliedDate: -1, createdAt: -1 },
  oldest: { appliedDate: 1, createdAt: 1 },
  company: { company: 1 },
};

// GET /api/applications?search=&status=&employmentType=&sort=&page=&limit=
export const getApplications = async (req, res) => {
  const { search, status, employmentType, sort = 'newest' } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  // Ownership: every query starts with the logged-in user's id
  const filter = { user: req.user._id };

  if (status) filter.status = status;
  if (employmentType) filter.employmentType = employmentType;
  if (search?.trim()) {
    const pattern = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ company: pattern }, { position: pattern }];
  }

  const sortBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

  const [applications, total] = await Promise.all([
    JobApplication.find(filter)
      .collation({ locale: 'en', strength: 2 })
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit),
    JobApplication.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: applications.length,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    data: applications,
  });
};

// GET /api/applications/stats
export const getStats = async (req, res) => {
  const grouped = await JobApplication.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const counts = Object.fromEntries(grouped.map((g) => [g._id, g.count]));
  const total = grouped.reduce((sum, g) => sum + g.count, 0);

  res.json({
    success: true,
    data: {
      total,
      applied: counts['Applied'] || 0,
      screening: counts['Screening'] || 0,
      interview: counts['Interview'] || 0,
      technicalTest: counts['Technical Test'] || 0,
      offers: counts['Offer'] || 0,
      rejected: counts['Rejected'] || 0,
      withdrawn: counts['Withdrawn'] || 0,
    },
  });
};

// Finds an application only if it belongs to the logged-in user.
// Someone else's record returns 404 (we don't reveal that it exists).
const findOwnedApplication = async (id, userId) => {
  const application = await JobApplication.findOne({ _id: id, user: userId });
  if (!application) throw new AppError('Application not found', 404);
  return application;
};

// GET /api/applications/:id
export const getApplication = async (req, res) => {
  const application = await findOwnedApplication(req.params.id, req.user._id);
  res.json({ success: true, data: application });
};

// POST /api/applications
export const createApplication = async (req, res) => {
  const application = await JobApplication.create({
    ...pickApplicationData(req.body),
    user: req.user._id, // always from the token, never from the request body
  });
  res.status(201).json({
    success: true,
    message: 'Application created',
    data: application,
  });
};

// PUT /api/applications/:id
export const updateApplication = async (req, res) => {
  const application = await findOwnedApplication(req.params.id, req.user._id);
  application.set(pickApplicationData(req.body));
  await application.save(); // runs model validation
  res.json({ success: true, message: 'Application updated', data: application });
};

// DELETE /api/applications/:id
export const deleteApplication = async (req, res) => {
  const application = await findOwnedApplication(req.params.id, req.user._id);
  await application.deleteOne();
  res.json({ success: true, message: 'Application deleted' });
};
