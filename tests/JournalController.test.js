const request = require('supertest');
const app = require('../app'); // adjust if your app filename is different

describe('JournalController API', () => {
  let createdJournalId;
  const dummyUserId = '000000000000000000000000';
  const dummyTrekId = '000000000000000000000000';

  test('POST /api/journals → should create a new journal entry', async () => {
    const res = await request(app)
      .post('/api/journals')
      .field('userId', dummyUserId)
      .field('trekId', dummyTrekId)
      .field('date', '2025-08-01')
      .field('text', 'Test journal entry')
      .attach('photos', Buffer.from('fake image'), 'test.jpg'); // optional

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.text).toBe('Test journal entry');

    createdJournalId = res.body._id;
  });

  test('GET /api/journals → should fetch all journal entries', async () => {
    const res = await request(app).get('/api/journals');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/journals/user/:userId → should fetch journals by user', async () => {
    const res = await request(app).get(`/api/journals/user/${dummyUserId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/journals/:trekId/:userId → should fetch journals by trek & user', async () => {
    const res = await request(app).get(`/api/journals/${dummyTrekId}/${dummyUserId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/journals/:id → should update journal text', async () => {
    const res = await request(app)
      .put(`/api/journals/${createdJournalId}`)
      .field('date', '2025-08-02')
      .field('text', 'Updated journal text');
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('Updated journal text');
  });

  test('DELETE /api/journals/:id → should delete the journal entry', async () => {
    const res = await request(app).delete(`/api/journals/${createdJournalId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Journal entry deleted successfully');
  });
});
