const { I } = inject();
const loginIdam = require('../authUser/loginIdam.js');
const data = require('../data.json');
function login() {
  I.seeElement('#username');
  loginIdam.signInWithCredentials(data.signIn.username, data.signIn.password);
  I.wait(2);
}
function logout() {
  I.amOnPage('/logout');
}

module.exports = { login, logout };
