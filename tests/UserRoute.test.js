const request = require('supertest');
const app = require('../app'); // import your express app

describe('User Routes', () => {

  test('POST /api/users/signup → should return 201 or appropriate response', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        username: 'testuser',
        password: 'testpass',
        userType: 'regular',
        gender: 'other',
        height: 170,
        weight: 65,
        address: 'Test Address'
      });
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500); // adjust based on your real response
  });

  test('GET /api/users → should fetch all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // you can keep adding tests for login, profile, saved journals, etc.

});
