const request = require('supertest');
require('dotenv').config();

describe('server', () => {
  let app;

  beforeAll(() => {
    process.env.MOCK = 'true';
    process.env.PORT = '0';
    app = require('../src/server');
  });

  test('GET /api/ping', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('POST /api/coach', async () => {
    const res = await request(app).post('/api/coach').send({ text: 'I feel a bit anxious today.' });
    expect(res.status).toBe(200);
    expect(res.body.mood).toBeDefined();
    expect(res.body.reply).toBeDefined();
  });
});
