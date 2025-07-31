const request = require('supertest');
const path = require('path');
const mongoose = require('mongoose');
const app = require('../app'); // Your Express app
require('dotenv').config();

// Increase timeout for file uploads
jest.setTimeout(30000);

describe('Journal Routes', () => {
  let createdJournalId;
  const testUserId = new mongoose.Types.ObjectId().toHexString();
  const testTrekId = new mongoose.Types.ObjectId().toHexString();

  const testImagePath = path.join(__dirname, 'test-image.jpg'); // make sure you have this image in tests folder

  // Test POST /api/journals (create entry with photos)
  test('POST /api/journals → should create a journal entry', async () => {
    const res = await request(app)
      .post('/api/journals')
      .field('userId', testUserId)
      .field('trekId', testTrekId)
      .field('date', '2025-07-31')
      .field('text', 'Test journal entry')
      .attach('photos', testImagePath);

    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.body).toHaveProperty('_id');
    createdJournalId = res.body._id;
  });

  // Test GET /api/journals (get all journals)
  test('GET /api/journals → should fetch all journals', async () => {
    const res = await request(app).get('/api/journals');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test GET /api/journals/user/:userId (get journals by user)
  test('GET /api/journals/user/:userId → should fetch journals by user', async () => {
    const res = await request(app).get(`/api/journals/user/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test GET /api/journals/:trekId/:userId (get journals by trek & user)
  test('GET /api/journals/:trekId/:userId → should fetch journals by trek & user', async () => {
    const res = await request(app).get(`/api/journals/${testTrekId}/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test PUT /api/journals/:id (update journal entry)
  test('PUT /api/journals/:id → should update journal', async () => {
    const res = await request(app)
      .put(`/api/journals/${createdJournalId}`)
      .field('date', '2025-08-01')
      .field('text', 'Updated journal entry text')
      .attach('photos', testImagePath);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdJournalId);
    expect(res.body.text).toBe('Updated journal entry text');
  });

  // Test DELETE /api/journals/:id (delete journal entry)
  test('DELETE /api/journals/:id → should delete journal', async () => {
    const res = await request(app).delete(`/api/journals/${createdJournalId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Journal entry deleted successfully');
  });
});
