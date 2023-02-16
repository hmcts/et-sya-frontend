const { I } = inject();

module.exports = {
  processLogin(test_case_username, test_case_password) {
    I.waitForElement('#username', 30);
    I.fillField('#username', test_case_username);
    I.fillField('#password', test_case_password);
    I.click('[type="submit"]');
  },
};
