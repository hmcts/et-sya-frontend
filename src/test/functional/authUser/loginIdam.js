const { I } = inject();

let username = process.env.TEST_CASE_USERNAME;
let password = process.env.TEST_CASE_PASSWORD;

function signInWithCredentials() {
  I.seeElement('#username');
  console.log(username, password);
  I.fillField('#username', username);
  I.fillField('#password', password);
  I.click('Sign in');
}
module.exports = { signInWithCredentials };
