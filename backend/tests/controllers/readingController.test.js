const request = require('supertest');
const app = require('../../server');
const Result = require('../../models/Result');

describe('Reading Controller', () => {
  const mockAudio = Buffer.from('mock audio data');

  test('POST /api/reading/analyze returns analysis', async () => {
    const response = await request(app)
      .post('/api/reading/analyze')
      .attach('audio', mockAudio, 'test.mp3')
      .field('text', 'Sample reading text');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('scores');
    expect(response.body).toHaveProperty('feedback');
  });

  test('GET /api/reading/tasks returns tasks', async () => {
    const response = await request(app)
      .get('/api/reading/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/reading/save-result saves result', async () => {
    const mockResult = {
      scores: { accuracy: 85, pronunciation: 80 },
      feedback: 'Good job!',
      detailedAnalysis: { wordAccuracy: {} }
    };

    const response = await request(app)
      .post('/api/reading/save-result')
      .send(mockResult);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
  });
}); 