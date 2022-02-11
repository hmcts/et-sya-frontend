require('ts-node').register({ project: 'src/test/functional/tsconfig.json' });

module.exports = require('./codecept.conf.ts');
