import mongoose from 'mongoose';

export const STATUSES = [
  'Applied',
  'Screening',
  'Interview',
  'Technical Test',
  'Offer',
  'Rejected',
  'Withdrawn',
];

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
  'Remote',
];

const jobApplicationSchema = new mongoose.Schema(
  {
    // Relationship: every application belongs to exactly one user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      maxlength: [100, 'Company cannot be longer than 100 characters'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      maxlength: [100, 'Position cannot be longer than 100 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot be longer than 100 characters'],
      default: '',
    },
    employmentType: {
      type: String,
      enum: { values: EMPLOYMENT_TYPES, message: '{VALUE} is not a valid employment type' },
      default: 'Full-time',
    },
    jobUrl: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (value) => !value || /^https?:\/\/\S+\.\S+/i.test(value),
        message: 'Job URL must be a valid http(s) link',
      },
    },
    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
      default: null,
    },
    status: {
      type: String,
      enum: { values: STATUSES, message: '{VALUE} is not a valid status' },
      default: 'Applied',
    },
    appliedDate: { type: Date, default: Date.now },
    interviewDate: { type: Date, default: null },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot be longer than 2000 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

// Speeds up the most common query: "my applications, newest first"
jobApplicationSchema.index({ user: 1, appliedDate: -1 });

export default mongoose.model('JobApplication', jobApplicationSchema);
