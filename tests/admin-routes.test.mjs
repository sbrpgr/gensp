import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../dist/_worker.js';

for (const path of ['/api/init-data', '/api/bulk-insert']) {
  test(`${path} rejects unauthenticated writes before database access`, async () => {
    let databaseUsed = false;
    const env = { DB: { prepare() { databaseUsed = true; throw new Error('Unexpected database access'); } } };
    const response = await worker.fetch(new Request(`https://example.test${path}`, { method: 'POST' }), env, { waitUntil() {} });
    assert.equal(response.status, 403);
    assert.equal(databaseUsed, false);
    assert.match((await response.json()).error, /disabled over HTTP/);
  });
}
