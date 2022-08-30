'use strict';

const testConfig = require('../../config');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.waitForText('Sign in');
  I.fillField('username', testConfig.TestEnvETUser);
  I.fillField('password', testConfig.TestEnvETPassword);
  I.click('input[value="Sign in"]');
};
