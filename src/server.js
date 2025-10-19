const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const { auth } = require('express-openid-connect');
const { loadConfig } = require('./config');
const logger = require('./logger');
const { callGemini, saveToSnowflake } = require('./clients');
const { exportHandler } = require('./services/snowflakeExport');

dotenv.config();
const env = loadConfig();

const app = express();

// Trust proxy if behind a reverse proxy
app.set('trust proxy', 1);

// Middleware
app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(compression());
app.use(cors({ origin: env.ALLOWED_ORIGIN === '*' ? true : env.ALLOWED_ORIGIN.split(',') }));
app.use(express.json({ limit: '1mb' }));

// Rate limit for API
const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use('/api', limiter);

// Static - serve React build in production, or fallback to public
const staticDir = env.NODE_ENV === 'production' 
  ? path.join(__dirname, '..', 'public-react')
  : path.join(__dirname, '..', 'public');
app.use(express.static(staticDir));

// Auth0 (enabled only if configured and not MOCK)
if (!env.MOCK && env.AUTH0_ISSUER_BASE_URL && env.AUTH0_CLIENT_ID && env.AUTH0_SECRET) {
  app.use(auth({
    authRequired: false,
    idpLogout: true,
    secret: env.AUTH0_SECRET,
    baseURL: env.AUTH0_BASE_URL || `http://localhost:${env.PORT}`,
    clientID: env.AUTH0_CLIENT_ID,
    issuerBaseURL: env.AUTH0_ISSUER_BASE_URL
  }));
}

// Health
app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Coach response (mood + supportive reply) via Gemini
app.post('/api/coach', async (req, res, next) => {
  try {
    const { text } = req.body || {};
    const input = text || 'Sample mental health check-in.';
    const prompt = `You are ClearMind, an empathetic mental health companion. Task:
1) Infer the user's mood in one word (e.g., calm, anxious, stressed, sad, happy).
2) Provide a brief, supportive response (max 120 words). Avoid clinical claims.
Return as JSON: { "mood": "...", "reply": "..." }.

Message: ${input}`;
    const result = await callGemini(prompt);
    let mood = 'neutral';
    let reply = result.text || '';
    try {
      const parsed = JSON.parse(result.text);
      mood = parsed.mood || mood;
      reply = parsed.reply || reply;
    } catch (_) {
      // If not valid JSON, fallback to plain text
    }
    res.json({ mood, reply });
  } catch (err) {
    next(err);
  }
});

// Save anonymized stats to Snowflake
app.post('/api/save', async (req, res, next) => {
  try {
    const { mood = 'neutral', tokens = 0 } = req.body || {};
    const saved = await saveToSnowflake({ mood, tokens, ts: new Date().toISOString() });
    res.json({ status: 'ok', saved });
  } catch (err) {
    next(err);
  }
});

// Export mood history to Snowflake (new comprehensive export)
app.post('/api/export/snowflake', exportHandler);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: 'Internal Server Error' });
});

let server;
if (require.main === module) {
  server = app.listen(env.PORT, () => {
    logger.info(`ClearMind running on http://localhost:${env.PORT}`);
  });
}

// Graceful shutdown
function shutdown(signal) {
  logger.info({ signal }, 'Shutting down');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

if (server) {
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = app;
