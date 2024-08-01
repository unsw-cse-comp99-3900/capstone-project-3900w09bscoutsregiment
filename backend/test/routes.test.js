import request from 'supertest';
import jwt from 'jsonwebtoken';
import { describe, it } from 'node:test';
import app from '../index.js';

describe('"/" route', (done) => {
  request(app)
    .get('/')
    .expect(200, done);
});

describe('api/auth/login route', (done) => {

  it('should login', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ email: 'tester@gmail.com', password: 'tester' })
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('/COMP1511/2024/T1 test', (done) => {
  it('shouldn\'t work without login', (done) => {
    request(app)
      .get('/api/course/COMP1511/2024/T1')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('should work with login', () => {
    // request(app)
    //   .post('/api/auth/login')
    //   .send({ email: 'tester@gmail.com', password: 'tester' })
    //   .expect('Content-Type', /json/)
    //   .expect(200)
    //   .then(res => {
    //   });
    request(app)
      .get('/api/course/COMP1511/2024/T1')
      .expect('Content-Type', /json/)
      .expect(200)
  });
});

setTimeout(() => {
  app.close();
}, 3000);
