/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

class LoginPage {
  // eslint-disable-next-line prettier/prettier
    signInText(){ return  cy.get('.form-section > .heading-medium');}
  usernameFeild() {
    return cy.get('#username');
  }
  passwordFeild() {
    return cy.get('#password');
  }
  signInButton() {
    return cy.get('[name="save"]');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async loginToContinueET1Application(username, password) {
    console.log('username: ' + username + ' password: ' + password);
    //await this.signInText().should('be.visible');
    this.signInText().should('contain.text', 'Sign in');
    this.usernameFeild().type(username);
    this.passwordFeild().type(password);
    this.signInButton().click();
  }
}
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

export default LoginPage;
