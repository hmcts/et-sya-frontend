/* eslint-disable */
const data = require('../data.json');
const { I } = inject();

function signInWithCredentials(username, password) {
  I.seeElement('#username');
  /* eslint-disable */
  I.fillField('#username', data.signIn.username);
  I.fillField('#password', data.signIn.password);
  /* eslint-enable */
  I.click('Sign in');
}
module.exports = { signInWithCredentials };
