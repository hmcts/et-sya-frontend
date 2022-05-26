import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {
  enableFor(server: Application): void {
    if (server.locals.ENV !== 'development') {
      propertiesVolume.addTo(config);

      this.setSecret('secrets.et.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
      this.setSecret('secrets.et.idam-secret', 'services.idam.clientSecret');
      this.setSecret('secrets.et.redis-access-key', 'session.redis.key');
      this.setSecret('secrets.et.redis-access-key', 'session.secret');
      this.setSecret('secrets.et.os-places-token', 'services.addressLookup.token');
      this.setSecret('secrets.pcq.et-token-key', 'services.pcq.token');
    }
  }

  private setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }
}
