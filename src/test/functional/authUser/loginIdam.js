const { I } = inject();

function signInWithCredentials(username, password) {
  I.seeElement('#username');
  I.fillField('#username', username);
  I.fillField('#password', password);
  I.click('Sign in');
}
module.exports = { signInWithCredentials };
