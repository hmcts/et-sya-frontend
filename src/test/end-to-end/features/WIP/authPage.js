const { I } = inject();
const loginIdam = require('../../authUser/loginIdam.js');
function login() {
  I.seeElement('#username');
  loginIdam.signInWithCredentials();
  I.wait(3);
}
function logout() {
  I.amOnPage('/logout');
}

module.exports = { login, logout };
