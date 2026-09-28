import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Render sits behind a proxy; needed for secure cookies and rate limiting
app.set('trust proxy', 1);

// Allowed frontend origins (comma-separated CLIENT_URL, no trailing slash)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''));

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools without an Origin header (Postman, curl, health checks)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // required so the browser sends the auth cookie
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use(
  '/api',
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 500, standardHeaders: true, legacyHeaders: false })
);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'JobTrack API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
