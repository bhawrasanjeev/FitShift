import test, { describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('AI Assistant Backend Route & Configuration Tests', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalGemini = process.env.GEMINI_API_KEY;
  const originalOpenAI = process.env.OPENAI_API_KEY;

  before(() => {
    process.env.NODE_ENV = 'test';
  });

  after(() => {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalGemini) process.env.GEMINI_API_KEY = originalGemini;
    else delete process.env.GEMINI_API_KEY;
    if (originalOpenAI) process.env.OPENAI_API_KEY = originalOpenAI;
    else delete process.env.OPENAI_API_KEY;
  });

  test('GET /api/ai/status should report unconfigured when no keys are present', async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const res = await request(app)
      .get('/api/ai/status')
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.data.configured, false);
    assert.equal(res.body.data.provider, null);
  });

  test('POST /api/ai/chat should return HTTP 503 and clear unconfigured message when key is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const res = await request(app)
      .post('/api/ai/chat')
      .send({ query: 'How can I increase protein at breakfast?' })
      .expect(503);

    assert.equal(res.body.success, false);
    assert.equal(res.body.message, 'AI service is not configured');
    assert.ok(res.body.error.message.includes('required'));
  });

  test('POST /api/ai/chat should return HTTP 400 when query is empty', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({})
      .expect(400);

    assert.equal(res.body.success, false);
    assert.ok(res.body.error.message.includes('Query'));
  });

  test('GET /api/ai/status should detect GEMINI_API_KEY when configured without leaking it', async () => {
    process.env.GEMINI_API_KEY = 'test-gemini-secret-key-12345';

    const res = await request(app)
      .get('/api/ai/status')
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.data.configured, true);
    assert.equal(res.body.data.provider, 'gemini');

    // Crucial: API key must NEVER be exposed in response body
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('test-gemini-secret-key-12345'), 'Secret API key must not be exposed');

    // Restore
    if (originalGemini) process.env.GEMINI_API_KEY = originalGemini;
    else delete process.env.GEMINI_API_KEY;
    if (originalOpenAI) process.env.OPENAI_API_KEY = originalOpenAI;
    else delete process.env.OPENAI_API_KEY;
  });
});
