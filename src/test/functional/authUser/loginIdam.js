const { I } = inject();

const testConfig = require('../config');
let username = testConfig.test_case_username;
let password = testConfig.test_case_password;

function signInWithCredentials() {
  I.seeElement('#username');
  I.fillField('#username', username);
  I.fillField('#password', password);
  I.click('Sign in');
}
module.exports = { signInWithCredentials };
