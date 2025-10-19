const { cleanEnv, str, bool, num } = require('envalid');

function loadConfig() {
  return cleanEnv(process.env, {
    NODE_ENV: str({ default: 'development' }),
    PORT: num({ default: 3000 }),
    MOCK: bool({ default: true }),
    ALLOWED_ORIGIN: str({ default: '*' }),
    // Gemini
    GEMINI_API_KEY: str({ default: '' }),
    GEMINI_MODEL: str({ default: 'gemini-1.5-flash-latest' }),
    // Auth0 (optional when MOCK=true)
    AUTH0_SECRET: str({ default: '' }),
    AUTH0_BASE_URL: str({ default: '' }),
    AUTH0_ISSUER_BASE_URL: str({ default: '' }),
    AUTH0_CLIENT_ID: str({ default: '' }),
    AUTH0_CLIENT_SECRET: str({ default: '' }),
  });
}

module.exports = { loadConfig };
