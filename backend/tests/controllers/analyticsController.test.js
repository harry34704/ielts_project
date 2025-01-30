const request = require('supertest');
const app = require('../../server');
const Result = require('../../models/Result');

describe('Analytics Controller', () => {
  beforeEach(async () => {
    // Insert test data
    await Result.insertMany([
      {
        type: 'reading',
        scores: { accuracy: 75, fluency: 80 },
        timestamp: new Date('2024-01-01')
      },
      {
        type: 'writing',
        scores: { grammar: 85, vocabulary: 70 },
        timestamp: new Date('2024-01-02')
      }
    ]);
  });

  test('GET /api/analytics/overview returns overview', async () => {
    const response = await request(app)
      .get('/api/analytics/overview');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalSessions');
    expect(response.body).toHaveProperty('skillBreakdown');
    expect(response.body).toHaveProperty('insights');
  });

  test('GET /api/analytics/progress returns progress', async () => {
    const response = await request(app)
      .get('/api/analytics/progress');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('reading');
    expect(response.body).toHaveProperty('writing');
    expect(response.body).toHaveProperty('speaking');
  });

  test('POST /api/analytics/generate-plan returns study plan', async () => {
    const response = await request(app)
      .post('/api/analytics/generate-plan');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('overview');
    expect(response.body).toHaveProperty('tasks');
    expect(response.body).toHaveProperty('recommendations');
  });
}); 