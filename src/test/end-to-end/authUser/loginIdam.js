const { I } = inject();
const config = require('../config.js');

function signInWithCredentials() {
  I.seeElement('#username');
  I.fillField('#username', config.TestEnvETUser);
  I.fillField('#password', config.TestEnvETPassword);
  I.click('Sign in');
}
module.exports = { signInWithCredentials };
