/* eslint-disable @typescript-eslint/no-unused-vars */
const data = require('../data.json');
const { I } = inject();

function signInWithCredentials(username, password) {
  I.seeElement('#username');
  I.fillField('#username', data.signIn.username);
  I.fillField('#password', data.signIn.password);
  I.click('Sign in');
}
module.exports = { signInWithCredentials };
