const request = require('supertest');
const app = require('../app'); // adjust if your app entry file is named differently

describe('UserController API', () => {
  let createdUserId;
  let token;

  test('POST /api/users/signup → should create a new user', async () => {
    const res = await request(app).post('/api/users/signup').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');

    // fetch to get created user ID
    const allUsers = await request(app).get('/api/users');
    const user = allUsers.body.find(u => u.username === 'testuser');
    expect(user).toBeTruthy();
    createdUserId = user._id;
  });

  test('POST /api/users/login → should login and return token', async () => {
    const res = await request(app).post('/api/users/login').send({
      username: 'testuser',
      password: 'testpassword'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', 'testuser');
    token = res.body.token;
  });

  test('GET /api/users → should fetch all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/users/profile/:id → should fetch user profile', async () => {
    const res = await request(app).get(`/api/users/profile/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdUserId);
  });

  test('PUT /api/users/profile/:id → should update user profile', async () => {
    const res = await request(app)
      .put(`/api/users/profile/${createdUserId}`)
      .send({ bio: 'Updated bio', location: 'Updated Location' });
    expect(res.statusCode).toBe(200);
    expect(res.body.bio).toBe('Updated bio');
    expect(res.body.location).toBe('Updated Location');
  });

  test('POST /api/users/upload-image → should upload a profile picture', async () => {
    const res = await request(app)
      .post('/api/users/upload-image')
      .attach('profilePicture', Buffer.from('testfile'), 'test.jpg');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Image uploaded successfully');
    expect(res.body).toHaveProperty('data'); // image URL/path
  });

  test('DELETE /api/users/:id → should delete the user', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });

  // OPTIONAL: add very basic saved & favorite journals tests if you want
  // just skip if you don’t have test data for journals
});

