import axios from 'axios';
import request from 'supertest';

import { app } from '../../../main/app';

describe('Brotli Security Guard (CVE-2026-111497)', () => {
  it('should set Axios default Accept-Encoding to omit Brotli', () => {
    expect(axios.defaults.headers.common['Accept-Encoding']).toBe('gzip, deflate');
  });

  it('should reject incoming requests with Content-Encoding: br with 415', async () => {
    const res = await request(app)
      .post('/any-path')
      .set('Content-Type', 'application/json')
      .set('Content-Encoding', 'br')
      .send('compressed-content');

    expect(res.status).toBe(415);
    expect(res.text).toContain('Unsupported Media Type: Brotli encoding is not supported');
  });

  it('should reject incoming requests with Content-Encoding: brotli with 415', async () => {
    const res = await request(app)
      .post('/any-path')
      .set('Content-Type', 'application/json')
      .set('Content-Encoding', 'brotli')
      .send('compressed-content');

    expect(res.status).toBe(415);
    expect(res.text).toContain('Unsupported Media Type: Brotli encoding is not supported');
  });
});
