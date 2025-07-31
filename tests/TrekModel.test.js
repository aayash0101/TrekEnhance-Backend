const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // your Express app
const Trek = require('../Model/TrekModel'); // adjust path if needed

describe('Trek API', () => {
  let createdTrekId;

  beforeAll(async () => {
    await mongoose.connect(process.env.Mongo_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Trek.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /api/treks → should create a new trek', async () => {
    const res = await request(app)
      .post('/api/treks')
      .send({
        name: 'Annapurna Base Camp',
        location: 'Nepal',
        smallDescription: 'Short summary of trek',
        description: 'Detailed description of trek',
        difficulty: 'MODERATE',
        distance: 65,
        bestSeason: 'Spring',
        imageUrl: 'http://example.com/abc.jpg',
        highlights: ['Snow peaks', 'Beautiful sunrise'],
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Annapurna Base Camp');

    createdTrekId = res.body._id;
  });

  test('GET /api/treks → should fetch all treks', async () => {
    const res = await request(app).get('/api/treks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/treks/:id → should fetch trek by ID', async () => {
    const res = await request(app).get(`/api/treks/${createdTrekId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdTrekId);
  });

  test('PUT /api/treks/:id → should update trek', async () => {
    const res = await request(app)
      .put(`/api/treks/${createdTrekId}`)
      .send({ description: 'Updated trek description', difficulty: 'HARD' });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe('Updated trek description');
    expect(res.body.difficulty).toBe('HARD');
  });

  test('POST /api/treks/:id/reviews → should add a review to the trek', async () => {
    const res = await request(app)
      .post(`/api/treks/${createdTrekId}/reviews`)
      .send({
        userId: new mongoose.Types.ObjectId(), // use dummy ID
        username: 'testuser',
        review: 'Amazing experience!',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.reviews.length).toBeGreaterThan(0);
    expect(res.body.reviews[0].review).toBe('Amazing experience!');
  });

  test('DELETE /api/treks/:id → should delete trek', async () => {
    const res = await request(app).delete(`/api/treks/${createdTrekId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message'); // e.g. "Trek deleted successfully"
  });
});
