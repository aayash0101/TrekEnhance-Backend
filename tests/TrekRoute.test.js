const request = require('supertest');
const path = require('path');
const mongoose = require('mongoose');
const app = require('../app'); // import your express app

let createdTrekId;

describe('Trek Routes', () => {
  afterAll(async () => {
    // Clean up: remove created trek & disconnect
    if (createdTrekId) {
      await request(app).delete(`/api/treks/${createdTrekId}`);
    }
    await mongoose.disconnect();
  });

  test('POST /api/treks → should create a trek', async () => {
    const res = await request(app)
      .post('/api/treks')
      .field('name', 'Test Trek')
      .field('location', 'Test Location')
      .field('description', 'Beautiful trek!')
      .attach('image', path.join(__dirname, 'test-image.jpg')); // add a small dummy image in tests folder

    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
    expect(res.body).toHaveProperty('_id');
    createdTrekId = res.body._id;
  });

  test('GET /api/treks → should fetch all treks', async () => {
    const res = await request(app).get('/api/treks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/treks/:id → should fetch single trek by id', async () => {
    if (!createdTrekId) return;
    const res = await request(app).get(`/api/treks/${createdTrekId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdTrekId);
  });

  test('POST /api/treks/:trekId/reviews → should add review', async () => {
    if (!createdTrekId) return;
    const res = await request(app)
      .post(`/api/treks/${createdTrekId}/reviews`)
      .send({ user: 'testuser', rating: 5, comment: 'Awesome!' });
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });

  test('GET /api/treks/:trekId/reviews → should get reviews', async () => {
    if (!createdTrekId) return;
    const res = await request(app).get(`/api/treks/${createdTrekId}/reviews`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/treks/reviews/all → should get all reviews from all treks', async () => {
    const res = await request(app).get('/api/treks/reviews/all');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
