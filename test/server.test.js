const request = require('supertest');
const app = require('../src/server');

describe('server', () => {
  it('GET /api/ping returns ok', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
