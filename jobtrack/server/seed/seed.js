// DEVELOPMENT ONLY: creates a demo user with sample applications.
// Usage: npm run seed      (refuses to run when NODE_ENV=production)
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import JobApplication from '../models/JobApplication.js';

if (process.env.NODE_ENV === 'production') {
  console.error('Seeding is disabled in production.');
  process.exit(1);
}

const DEMO = { name: 'Demo User', email: 'demo@jobtrack.dev', password: 'Demo1234' };

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const samples = [
  ['Google', 'Frontend Engineer', 'Remote', 'Full-time', 'Interview', 3],
  ['Stripe', 'Backend Engineer', 'Dublin, Ireland', 'Full-time', 'Screening', 5],
  ['Shopify', 'Full-stack Developer', 'Remote', 'Remote', 'Applied', 6],
  ['Spotify', 'React Developer', 'Stockholm, Sweden', 'Full-time', 'Technical Test', 8],
  ['Airbnb', 'Software Engineer Intern', 'San Francisco, USA', 'Internship', 'Applied', 9],
  ['Netflix', 'UI Engineer', 'Los Gatos, USA', 'Full-time', 'Rejected', 14],
  ['Notion', 'Product Engineer', 'Remote', 'Full-time', 'Offer', 20],
  ['Slack', 'Node.js Developer', 'Remote', 'Contract', 'Withdrawn', 25],
  ['Atlassian', 'MERN Stack Developer', 'Sydney, Australia', 'Full-time', 'Applied', 2],
  ['Canva', 'Web Developer', 'Remote', 'Part-time', 'Screening', 1],
];

const run = async () => {
  await connectDB();

  await JobApplication.deleteMany({ user: (await User.findOne({ email: DEMO.email }))?._id });
  await User.deleteOne({ email: DEMO.email });

  const user = await User.create(DEMO);
  await JobApplication.insertMany(
    samples.map(([company, position, location, employmentType, status, ago]) => ({
      user: user._id,
      company,
      position,
      location,
      employmentType,
      status,
      appliedDate: daysAgo(ago),
      interviewDate: status === 'Interview' ? new Date(Date.now() + 3 * 86400000) : null,
      notes: 'Sample data created by the seed script.',
    }))
  );

  console.log(`Seeded ${samples.length} applications.`);
  console.log(`Demo login -> ${DEMO.email} / ${DEMO.password}`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
