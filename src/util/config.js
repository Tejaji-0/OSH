const { cleanEnv, str, bool, port } = require('envalid');

const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  PORT: port({ default: 3000 }),
  MOCK: bool({ default: true }),
  CORS_ORIGIN: str({ default: '*' }),
  GEMINI_API_KEY: str({ default: '' }),
  SNOWFLAKE_ACCOUNT: str({ default: '' }),
  SNOWFLAKE_USER: str({ default: '' }),
  SNOWFLAKE_PRIVATE_KEY: str({ default: '' }),
  GRADIENT_API_KEY: str({ default: '' }),
  AUTH0_DOMAIN: str({ default: '' }),
  AUTH0_CLIENT_ID: str({ default: '' }),
  AUTH0_CLIENT_SECRET: str({ default: '' }),
});

module.exports = { env };
