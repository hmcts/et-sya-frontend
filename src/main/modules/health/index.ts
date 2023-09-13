import { Application } from 'express';

const healthcheck = require('@hmcts/nodejs-healthcheck');

/**
 * Sets up the HMCTS health endpoints
 */
export class HealthCheck {
  public enableFor(app: Application): void {
    const redis = app.locals.redisClient
      ? healthcheck.raw(() => (app.locals.redisClient.ping() ? healthcheck.up() : healthcheck.down()))
      : null;

    const idamUrl: string = process.env.IDAM_API_URL ?? 'http://localhost:5000/o/token';

    healthcheck.addTo(app, {
      checks: {
        ...(redis ? { redis } : {}),
        'idam-api': healthcheck.web(new URL('/health', idamUrl.replace('/o/token', ''))),
      },
      ...(redis
        ? {
            readinessChecks: {
              redis,
            },
          }
        : {}),
    });
  }
}
