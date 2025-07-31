const request = require('supertest');
const app = require('../app'); // adjust if your app file has a different name

describe('TrekController API', () => {
  let createdTrekId;

  test('POST /api/treks → should create a new trek', async () => {
    const res = await request(app)
      .post('/api/treks')
      .field('name', 'Test Trek')
      .field('location', 'Test Location')
      .field('smallDescription', 'Short desc')
      .field('description', 'Detailed description')
      .field('difficulty', 'EASY')
      .field('distance', '15')
      .field('bestSeason', 'Spring')
      .field('highlights', 'View,Sunrise') // comma separated
      .attach('image', Buffer.from('fake image'), 'test.jpg'); // test upload

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Test Trek');

    createdTrekId = res.body._id;
  });

  test('GET /api/treks → should fetch all treks', async () => {
    const res = await request(app).get('/api/treks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/treks/:id → should fetch trek by ID', async () => {
    const res = await request(app).get(`/api/treks/${createdTrekId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdTrekId);
  });

  test('PUT /api/treks/:id → should update the trek', async () => {
    const res = await request(app)
      .put(`/api/treks/${createdTrekId}`)
      .field('name', 'Updated Trek Name')
      .field('highlights', 'Updated,Highlight');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Trek Name');
    expect(Array.isArray(res.body.highlights)).toBe(true);
  });

  test('POST /api/treks/:trekId/reviews → should add a review', async () => {
    const res = await request(app)
      .post(`/api/treks/${createdTrekId}/reviews`)
      .send({
        userId: '000000000000000000000000', // fake but valid ObjectId
        username: 'testuser',
        review: 'Amazing trek!'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Review added');
    expect(Array.isArray(res.body.reviews)).toBe(true);
  });

  test('GET /api/treks/:trekId/reviews → should get reviews for the trek', async () => {
    const res = await request(app).get(`/api/treks/${createdTrekId}/reviews`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/treks/reviews/all → should get all reviews from all treks', async () => {
    const res = await request(app).get('/api/treks/reviews/all');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('DELETE /api/treks/:id → should delete the trek', async () => {
    const res = await request(app).delete(`/api/treks/${createdTrekId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Trek deleted successfully');
  });
});
