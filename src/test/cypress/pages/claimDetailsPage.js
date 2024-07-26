
class ClaimDetailsPage {

  // eslint-disable-next-line prettier/prettier
    clickClaimDetailsLink(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('[href="/claim-type-discrimination?lng=en"]'); }
    discriminationAge(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#age'); }
    discriminationDisability(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#disability');}
    claimSummaryTextField(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#claim-summary-text');}
    compensationOption(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#compensationOnly');}
    tribunalRecommendationOption(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#tribunalRecommendation');}
    oldJobOption(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#oldJob');}
    compensationOutputOption(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#compensationOutcome');}
    compensationAmountOption(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#compensation-amount');}
    tribunalRecommendationRequestOption(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#tribunalRecommendationRequest');}
    whistleblowingClaimOption(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#whistleblowing-claim');}
    whistleblowingEntityNameOption(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#whistleblowing-entity-name');}
    checkedLinkedCases(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#linkedCases');}
    claimDetailsCheck(): Cypress.Chainable<JQuery<HTMLElement>>{ return cy.get('#claim-details-check');}
    continueToNextPageButton(): Cypress.Chainable<JQuery<HTMLElement>> {return cy.get('#main-form-submit');}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async processClaimDetails() {
    await this.clickClaimDetailsLink().should('be.visible');
    await this.clickClaimDetailsLink().click();
    //await cy.wait(3000);
    await cy.contains('What type of discrimination are you claiming?');
    this.discriminationAge().check();
    this.discriminationDisability().check();
    await this.continueToNextPageButton().click();
    await cy.contains('Describe what happened to you');
    await this.claimSummaryTextField().should('be.visible');
    this.claimSummaryTextField().type('Discrimination, Dismissal and Pay Cut.');
    await this.continueToNextPageButton().click();
    await this.compensationOption().should('be.visible');
    await cy.contains('What do you want if your claim is successful? (optional)');
    await this.compensationOption().check();
    this.tribunalRecommendationOption().check();
    this.oldJobOption().check();
    await this.continueToNextPageButton().click();
    await this.compensationOutputOption().should('be.visible');
    await cy.contains('What compensation are you seeking? (optional)');
    await this.compensationOutputOption().type('`Seeking months wage and job back');
    this.compensationAmountOption().type('100000');
    await this.continueToNextPageButton().click();
    await this.tribunalRecommendationRequestOption().should('be.visible');
    await cy.contains('Do you have a tribunal recommendation request? (optional)');
    this.tribunalRecommendationRequestOption().type('Get Job back and my boss to say sorry');
    await this.continueToNextPageButton().click();
    await this.whistleblowingClaimOption().should('be.visible');
    await cy.contains('Whistleblowing claims (optional)');
    this.whistleblowingClaimOption().check();
    this.whistleblowingEntityNameOption().type('Test Entity');
    this.checkedLinkedCases().click();
    this.claimDetailsCheck().click();
  }
}

export default ClaimDetailsPage;
