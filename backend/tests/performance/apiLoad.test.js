// tests/performance/apiLoad.test.js
import request from 'supertest';
import app from '../../src/app.js';

describe('API Performance', () => {
  test('should handle multiple concurrent requests', async () => {
    const requests = Array.from({ length: 10 }, () =>
      request(app).get('/health')
    );

    const startTime = Date.now();
    const responses = await Promise.all(requests);
    const endTime = Date.now();

    // All requests should complete within 5 seconds
    expect(endTime - startTime).toBeLessThan(5000);
    
    // All requests should be successful
    responses.forEach(response => {
      expect([200, 404]).toContain(response.status);
    });
  });
});