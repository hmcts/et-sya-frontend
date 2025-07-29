import config from 'config';

const appInsights = require('applicationinsights');

export class AppInsights {
  enable(): void {
    const connectionString = config.get('appInsights.connectionString');
    if (connectionString) {
      appInsights.setup(connectionString).setSendLiveMetrics(true).start();
      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] =
        config.get('appInsights.roleName');
      appInsights.defaultClient.trackTrace({
        message: 'App insights activated',
      });
    }
  }
}
