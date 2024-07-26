/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

class LoginPage {
  // eslint-disable-next-line prettier/prettier
    signInText(): Cypress.Chainable<JQuery<HTMLElement>>{ return  cy.get('.form-section > .heading-medium');}
    usernameFeild(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#username');}
    passwordFeild(): Cypress.Chainable<JQuery<HTMLElement>>{ return  cy.get('#password');}
    signInButton(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('[name="save"]');}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async loginToContinueET1Application(username, password) {
    console.log('username: ' + username + ' password: ' + password);
    await this.signInText().should('be.visible');
    this.signInText().should('contain.text', 'Sign in');
    this.usernameFeild().type(username);
    this.passwordFeild().type(password);
    this.signInButton().click();
  }
}
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

export default LoginPage;
