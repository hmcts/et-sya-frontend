import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {
  enableFor(server: Application): void {
    if (server.locals.ENV !== 'development' && server.locals.ENV !== 'test') {
      propertiesVolume.addTo(config);

      this.setSecret('secrets.et.app-insights-connection-string', 'appInsights.connectionString');
      this.setSecret('secrets.et.idam-secret', 'services.idam.clientSecret');
      this.setSecret('secrets.et.redis-access-key', 'session.redis.key');
      this.setSecret('secrets.et.redis-access-key', 'session.secret');
      this.setSecret('secrets.et.os-places-token', 'services.addressLookup.token');
      this.setSecret('secrets.et.pcq-token-key', 'services.pcq.token');
      this.setSecret('secrets.et.launch-darkly-sdk-key', 'services.launchDarkly.key');
      this.setSecret('secrets.et.csrf-token-secret', 'csrf.secret');
    }
  }

  private setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }
}
