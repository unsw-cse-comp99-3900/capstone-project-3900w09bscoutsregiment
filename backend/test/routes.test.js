import request from 'supertest';
import { describe, it } from 'node:test';
import app from '../index.js';

describe('"/" route', () => {
  request(app)
    .get('/')
    .expect(200);
});

setTimeout(() => {
  app.close();
}, 3000);
