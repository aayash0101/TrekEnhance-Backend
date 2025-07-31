const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // your Express app
const User = require('../Model/UserModel'); // your User model

describe('User API', () => {
  let createdUserId;

  beforeAll(async () => {
    await mongoose.connect(process.env.Mongo_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /api/users/signup → should create a new user', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        username: 'testuser',
        password: 'testpassword',
        email: 'testuser@example.com',
        bio: 'This is a test bio',
        location: 'Test City',
        profileImageUrl: '',
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  test('GET /api/users → should fetch all users and store a userId for next tests', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    // Store the first user's _id for next tests
    createdUserId = res.body[0]._id;
  });

  test('GET /api/users/profile/:id → should fetch user by ID', async () => {
    const res = await request(app).get(`/api/users/profile/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdUserId);
  });

  test('PUT /api/users/profile/:id → should update user bio and location', async () => {
    const res = await request(app)
      .put(`/api/users/profile/${createdUserId}`)
      .send({ bio: 'Updated bio', location: 'Updated Location' });

    expect(res.statusCode).toBe(200);
    expect(res.body.bio).toBe('Updated bio');
    expect(res.body.location).toBe('Updated Location');
  });

  test('DELETE /api/users/:id → should delete the user', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message'); // e.g. "User deleted successfully"
  });
});
