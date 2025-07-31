// tests/app.test.js
const request = require('supertest');
const app = require('../app');

let server;

beforeAll((done) => {
  server = app.listen(4000, () => {
    console.log('Test server running on port 4000');
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

test('GET /hey should return Hello World!', async () => {
  const res = await request(server).get('/hey');
  expect(res.statusCode).toBe(200);
  expect(res.text).toBe('Hello World!');
});
