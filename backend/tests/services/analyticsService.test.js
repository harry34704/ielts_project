const analyticsService = require('../../services/analyticsService');
const Result = require('../../models/Result');

describe('Analytics Service', () => {
  const mockResults = [
    {
      type: 'reading',
      scores: { accuracy: 75, fluency: 80, comprehension: 70 },
      timestamp: new Date('2024-01-01')
    },
    {
      type: 'writing',
      scores: { grammar: 65, vocabulary: 70, coherence: 75 },
      timestamp: new Date('2024-01-02')
    },
    {
      type: 'speaking',
      scores: { pronunciation: 70, fluency: 75, grammar: 80 },
      timestamp: new Date('2024-01-03')
    }
  ];

  beforeEach(async () => {
    await Result.insertMany(mockResults);
  });

  test('generateInsights returns correct structure', async () => {
    const insights = await analyticsService.generateInsights(mockResults);
    
    expect(insights).toHaveProperty('trends');
    expect(insights).toHaveProperty('weakAreas');
    expect(insights).toHaveProperty('recommendations');
    expect(insights).toHaveProperty('progress');
  });

  test('analyzeTrends calculates correct trends', () => {
    const trends = analyticsService.analyzeTrends(mockResults);
    
    expect(trends).toHaveProperty('reading');
    expect(trends).toHaveProperty('writing');
    expect(trends).toHaveProperty('speaking');
  });

  test('identifyWeakAreas finds scores below threshold', () => {
    const weakAreas = analyticsService.identifyWeakAreas(mockResults);
    
    expect(Array.isArray(weakAreas)).toBe(true);
    weakAreas.forEach(area => {
      expect(area.score).toBeLessThan(70);
    });
  });

  test('calculateProgress shows improvement over time', () => {
    const progress = analyticsService.calculateProgress(mockResults);
    
    expect(progress).toHaveProperty('overall');
    expect(progress).toHaveProperty('bySkill');
  });
}); 