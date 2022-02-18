import os from 'os';

import config from 'config';
import { Application } from 'express';

const healthcheck = require('@hmcts/nodejs-healthcheck');

/**
 * Sets up the HMCTS info and health endpoints
 */
export class HealthCheck {
  public enableFor(app: Application): void {
    const redis = app.locals.redisClient
      ? healthcheck.raw(() => (app.locals.redisClient.ping() ? healthcheck.up() : healthcheck.down()))
      : null;

    const idamUrl = config.get('services.idam.tokenURL') as string;

    healthcheck.addTo(app, {
      checks: {
        'idam-api': healthcheck.web(new URL('/health', idamUrl.replace('/o/token', ''))),
      },
      ...(redis
        ? {
            readinessChecks: {
              redis,
            },
          }
        : {}),
      buildInfo: {
        host: os.hostname(),
        name: 'et-sya-frontend',
        uptime: process.uptime(),
      },
    });
  }
}
