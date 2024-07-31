import request from 'supertest';
import jwt from 'jsonwebtoken';
import { describe, it } from 'node:test';
import app from '../index.js';

describe('"/" route', (done) => {
  request(app)
    .get('/')
    .expect(200, done);
});

describe('login test', (done) => {
  const agent = request.agent(app);

  it('should login', (done) => {
    agent
    .post('/api/auth/login')
    .send({ email: 'tester@gmail.com', password: 'tester' })
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('login test', () => {
});

setTimeout(() => {
  app.close();
}, 3000);
