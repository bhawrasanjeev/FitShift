import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import config from '../src/config/env.js';

describe('FitShift API - Phase 1 Foundation Tests', () => {
  describe('GET /api/health', () => {
    it('should return HTTP 200 with expected JSON response', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      assert.deepEqual(res.body, {
        success: true,
        message: 'FitShift API is running'
      });
    });
  });

  describe('Unknown Route Handling (404)', () => {
    it('should return HTTP 404 with consistent JSON error response for unknown GET', async () => {
      const res = await request(app)
        .get('/api/non-existent-route')
        .expect('Content-Type', /json/)
        .expect(404);

      assert.equal(res.body.success, false);
      assert.ok(res.body.error);
      assert.match(res.body.error.message, /Route not found/);
    });

    it('should return HTTP 404 with consistent JSON error response for unknown POST', async () => {
      const res = await request(app)
        .post('/api/unknown')
        .send({ test: true })
        .expect('Content-Type', /json/)
        .expect(404);

      assert.equal(res.body.success, false);
      assert.ok(res.body.error);
      assert.match(res.body.error.message, /Route not found/);
    });
  });

  describe('CORS Configuration', () => {
    it('should include CORS headers when request origin matches CLIENT_URL', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', config.clientUrl)
        .expect(200);

      assert.equal(res.headers['access-control-allow-origin'], config.clientUrl);
    });
  });

  describe('HTTP Security Headers (Helmet)', () => {
    it('should include standard security headers', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);

      assert.equal(res.headers['x-content-type-options'], 'nosniff');
      assert.ok(res.headers['x-dns-prefetch-control']);
    });
  });
});
