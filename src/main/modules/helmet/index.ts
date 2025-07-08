import envConfig from 'config';
import * as express from 'express';
import helmet from 'helmet';

export interface HelmetConfig {
  referrerPolicy: ReferrerPolicy;
}

const dynatrace = '*.dynatrace.com';
const googleAnalyticsDomain1 = '*.google-analytics.com';
const googleAnalyticsDomain2 = '*.analytics.google.com';
const tagManager = ['*.googletagmanager.com', '*.tagmanager.google.com'];
const azureBlob = '*.blob.core.windows.net';
const webChat = 'https://vcc-eu4.8x8.com';
const webChat_cf = 'https://vcc-eu4-cf.8x8.com';
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
    const idamUrl = process.env.IDAM_WEB_URL ?? envConfig.get('services.idam.authorizationURL').toString();
    const scriptSrc = [
      self,
      ...tagManager,
      dynatrace,
      googleAnalyticsDomain1,
      googleAnalyticsDomain2,
      "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
      "'sha256-jRBbox3kYELTBlbH5MUuba3ueT9bVKJ2beih/WmA5XA='",
      "'sha256-sZMpt4mxRf2FbN1eXmS8x0BW1uGzJT/wjKE+ws9LwGM='",
      "'sha256-3GXApuK7cB2BF9uHQgwMqeha+0b6kRylpUppmrrA2Ng='",
      "'sha256-mELJSxgt9A4MuAKrIJ7iuPz6oxsbl7cp5iTieONZHSw='",
      "'sha256-FiZUeT/V4X81LXdIxje1wtfEjtxsNS8gTc9lEdDKSd8='",
      "'sha256-A7Uu54feRuB88PgtD97QX8ZfJfCfC4LuAP3rCwwhnbE='",
      "'sha256-TrZe7TNXf5jal9UL8qSy3pDcRFvZ3IbumaN7m05kuqY='",
      "'sha256-aXmvy0r4VTfGzDelklEkOYupLUj3qI9Gwx8DXWQb4YE='",
      "'sha256-BxZiXSZ/Vto7GjFKGm4Sdu3xoxmzp1Xjm7HSW3lLUvQ='",
      "'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='",
      idamUrl,
      webChat,
      webChat_cf,
    ];

    const connectSrc = [
      self,
      dynatrace,
      googleAnalyticsDomain1,
      googleAnalyticsDomain2,
      idamUrl,
      'https://bf24054dsx.bf.dynatrace.com',
      '*.8x8.com',
    ];

    const imgSrc = [
      self,
      azureBlob,
      dynatrace,
      googleAnalyticsDomain1,
      googleAnalyticsDomain2,
      ...tagManager,
      'data:',
      'https://ssl.gstatic.com',
      'https://www.gstatic.com',
      'https://fonts.googleapis.com',
      '*.8x8.com',
    ];

    const frameSrc = [self, webChat, webChat_cf];

    const styleSrc = [
      self,
      "'unsafe-hashes'",
      "'sha256-FW89RU1NGOU/HqKhCL5513EwBQh+TCGIBM/8TCnEIAQ='",
      '*.fonts.googleapis.com',
      '*.tagmanager.google.com',
    ];

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
          fontSrc: [self, 'data:', 'https://fonts.gstatic.com'],
          imgSrc,
          frameSrc,
          objectSrc: [self],
          scriptSrc,
          styleSrc,
          formAction: [self, ...formActionUrls],
          manifestSrc: [self],
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
