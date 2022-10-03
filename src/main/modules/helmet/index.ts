import * as express from 'express';
import helmet from 'helmet';

export interface HelmetConfig {
  referrerPolicy: ReferrerPolicy;
}

const googleAnalyticsDomain = '*.google-analytics.com';
const tagManager = ['*.googletagmanager.com', 'https://tagmanager.google.com'];
const azureBlob = '*.blob.core.windows.net';
const self = "'self'";

/**
 * Module that enables helmet in the application
 */
export class Helmet {
  constructor(public config: HelmetConfig, public formActionUrls: string[]) {}

  public enableFor(app: express.Express): void {
    // include default helmet functions
    app.use(helmet());

    this.setContentSecurityPolicy(app, this.formActionUrls);
    this.setReferrerPolicy(app, this.config.referrerPolicy);
  }

  private setContentSecurityPolicy(app: express.Express, formActionUrls: string[]): void {
    const scriptSrc = [
      self,
      ...tagManager,
      googleAnalyticsDomain,
      "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
      "'sha256-jRBbox3kYELTBlbH5MUuba3ueT9bVKJ2beih/WmA5XA='",
      "'sha256-sZMpt4mxRf2FbN1eXmS8x0BW1uGzJT/wjKE+ws9LwGM='",
      'https://idam-web-public.aat.platform.hmcts.net/',
    ];

    const connectSrc = [self, googleAnalyticsDomain, 'https://localhost:5000/'];

    const imgSrc = [
      self,
      azureBlob,
      ...tagManager,
      googleAnalyticsDomain,
      'data:',
      'https://ssl.gstatic.com',
      'https://www.gstatic.com',
    ];

    if (app.locals.developmentMode) {
      scriptSrc.push("'unsafe-eval'");
    }
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          connectSrc,
          defaultSrc: ["'none'"],
          fontSrc: [self, 'data:'],
          imgSrc,
          objectSrc: [self],
          scriptSrc,
          styleSrc: [self],
          formAction: [self, ...formActionUrls],
        },
      })
    );
  }

  private setReferrerPolicy(app: express.Express, policy: ReferrerPolicy): void {
    if (!policy) {
      throw new Error('Referrer policy configuration is required');
    }

    app.use(helmet.referrerPolicy({ policy }));
  }
}
