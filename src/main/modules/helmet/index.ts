import envConfig from 'config';
import * as express from 'express';
import helmet from 'helmet';

export interface HelmetConfig {
  referrerPolicy: ReferrerPolicy;
}

const googleAnalyticsDomain = '*.google-analytics.com';
const tagManager = ['*.googletagmanager.com', 'https://tagmanager.google.com', 'https://vcc-eu4.8x8.com'];
const azureBlob = '*.blob.core.windows.net';
const webChat = 'https://vcc-eu4.8x8.com';
const self = "'self'";

/**
 * Module that enables helmet in the application
 */
export class Helmet {
  constructor(public config: HelmetConfig, public formActionUrls: string[]) {}

  public enableFor(app: express.Express): void {
    // include default helmet functions
    app.use(helmet({ crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: false }));

    this.setContentSecurityPolicy(app, this.formActionUrls);
    this.setReferrerPolicy(app, this.config.referrerPolicy);
  }

  private setContentSecurityPolicy(app: express.Express, formActionUrls: string[]): void {
    const idamUrl = envConfig.get('services.idam.authorizationURL').toString();
    const scriptSrc = [
      self,
      ...tagManager,
      googleAnalyticsDomain,
      "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
      "'sha256-jRBbox3kYELTBlbH5MUuba3ueT9bVKJ2beih/WmA5XA='",
      "'sha256-sZMpt4mxRf2FbN1eXmS8x0BW1uGzJT/wjKE+ws9LwGM='",
      "'sha256-3GXApuK7cB2BF9uHQgwMqeha+0b6kRylpUppmrrA2Ng='",
      "'sha256-mELJSxgt9A4MuAKrIJ7iuPz6oxsbl7cp5iTieONZHSw='",
      "'sha256-FiZUeT/V4X81LXdIxje1wtfEjtxsNS8gTc9lEdDKSd8='",
      idamUrl,
    ];

    const connectSrc = [self, googleAnalyticsDomain, idamUrl];

    const imgSrc = [
      self,
      azureBlob,
      ...tagManager,
      googleAnalyticsDomain,
      'data:',
      'https://ssl.gstatic.com',
      'https://www.gstatic.com',
    ];

    const frameSrc = [self, webChat];

    const styleSrc = [self, "'unsafe-hashes'", "'unsafe-inline'"];

    if (app.locals.developmentMode) {
      connectSrc.push('https://localhost:5000/login');
      scriptSrc.push('https://localhost:5000/login');
      scriptSrc.push("'unsafe-eval'");
    }
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          connectSrc,
          defaultSrc: ["'none'"],
          fontSrc: [self, 'data:'],
          imgSrc,
          frameSrc,
          objectSrc: [self],
          scriptSrc,
          styleSrc,
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
