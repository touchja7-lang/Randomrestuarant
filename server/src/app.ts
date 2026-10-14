import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { config } from 'dotenv';

import { authRouter } from './routes/auth.routes';
import { restaurantRouter } from './routes/restaurant.routes';
import { randomRouter } from './routes/random.routes';
import { historyRouter } from './routes/history.routes';
import { notFoundMiddleware } from './middleware/notFound.middleware';
import { errorMiddleware } from './middleware/error.middleware';

config();

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = clientUrl
  ? clientUrl.includes(',')
    ? clientUrl.split(',').map((u) => u.trim())
    : clientUrl
  : true;

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check (for Cloud Deployment platforms) ───────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/random', randomRouter);
app.use('/api/v1/history', historyRouter);

// ─── Production Static Frontend Serving ───────────────────────────────────────
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
