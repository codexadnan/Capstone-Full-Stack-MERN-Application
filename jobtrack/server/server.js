import dotenv from 'dotenv';
dotenv.config({ quiet: true }); // must run before other modules read process.env

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined. Add it to your .env file.');
    process.exit(1);
  }
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
