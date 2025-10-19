const fetch = require('node-fetch');
const { loadConfig } = require('./config');
const logger = require('./logger');

// Gemini client stub
async function callGemini(prompt) {
  const env = loadConfig();
  if (env.MOCK) {
    return { text: `MOCK Gemini response for prompt: ${prompt.substring(0, 80)}...` };
  }
  // Real Gemini API (REST) example for text generation
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent?key=${env.GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }]}]
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const t = await res.text();
    logger.error({ status: res.status, t }, 'Gemini API error');
    throw new Error(`Gemini API error: ${res.status}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return { text };
}

// Snowflake client stub
async function saveToSnowflake(row) {
  const env = loadConfig();
  if (env.MOCK) {
    return { success: true, id: 'mock-row-1' };
  }
  // Replace with real Snowflake REST API or driver usage
  throw new Error('Not implemented: Snowflake save');
}

// Gradient stub
async function callGradient(model, input) {
  const env = loadConfig();
  if (env.MOCK) {
    return { output: `MOCK Gradient output for model=${model}` };
  }
  throw new Error('Not implemented: Gradient call');
}

// Auth0 stub (exchange code -> user info)
async function getAuth0User(token) {
  const env = loadConfig();
  if (env.MOCK) {
    return { sub: 'auth0|mock', name: 'Mock User' };
  }
  throw new Error('Not implemented: Auth0 call');
}

module.exports = { callGemini, saveToSnowflake, callGradient, getAuth0User };
