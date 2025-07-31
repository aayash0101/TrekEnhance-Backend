const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // adjust if your entry point is different

describe('JournalEntry API', () => {
  let createdJournalId;

  // POST /api/journals → create a new journal
  test('POST /api/journals → should create a new journal entry', async () => {
    const res = await request(app)
      .post('/api/journals')
      .field('userId', new mongoose.Types.ObjectId().toString())
      .field('trekId', new mongoose.Types.ObjectId().toString())
      .field('date', '2025-07-31')
      .field('text', 'Test journal entry')
      .attach('photos', Buffer.from('dummy file'), 'test.jpg');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdJournalId = res.body._id;
  });

  // GET /api/journals → fetch all journal entries
  test('GET /api/journals → should fetch all journal entries', async () => {
    const res = await request(app).get('/api/journals');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // PUT /api/journals/:id → update journal text
  test('PUT /api/journals/:id → should update journal text', async () => {
    const res = await request(app)
      .put(`/api/journals/${createdJournalId}`)
      .field('text', 'Updated text');

    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('Updated text');
  });

  // DELETE /api/journals/:id → delete journal entry
  test('DELETE /api/journals/:id → should delete journal entry', async () => {
    const res = await request(app).delete(`/api/journals/${createdJournalId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message'); // e.g., "Journal deleted successfully"
  });
});
