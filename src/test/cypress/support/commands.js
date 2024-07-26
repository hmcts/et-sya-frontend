import testConfig from '../fixtures/config.json';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('createAccount', (firstName, lastName, emailAddress, genPassword) => {
  cy.request({
    method: 'POST',
    url: testConfig.create_api_account_url,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      forename: firstName,
      surname: lastName,
      email: emailAddress,
      password: genPassword,
      active: true,
      roles: [
        {
          code: 'citizen',
        },
      ],
    }),
  }).then(response => {
    // Optionally store the response data for use in tests
    // eslint-disable-next-line jest/valid-expect
    expect(response.status).to.eq(201);
    Cypress.env('user', response.body);
  });
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
