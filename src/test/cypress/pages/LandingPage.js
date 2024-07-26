/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

class LandingPage {
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  // eslint-disable-next-line prettier/prettier
  startNowButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.govuk-button--start').first();
  }

  makeClaimHeader(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.govuk-heading-xl');
  }

  beforeYouContinueHeader(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.govuk-heading-l');
  }

  continueToPostCode(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[href="/work-postcode"]');
  }

  postcodeTextHeader(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.govuk-heading-xl');
  }

  postcodeTextFeild(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#workPostcode');
  }

  continueToNextPageButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#main-form-submit');
  }

  representingSelf(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#lip-or-representative');
  }

  actForSomeoneElse(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#lip-or-representative-2');
  }

  legalRepSingleClaimant(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#lip-or-representative-3');
  }

  legalRepGroupClaim(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#lip-or-representative-4');
  }

  makingYourClaimCheckBox(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#single-or-multiple-claim');
  }

  acasHeaderText(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.govuk-heading-xl');
  }

  yesToAcas(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#acas-multiple');
  }

  noToAcas(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#acas-multiple-2');
  }

  claimTypeHeaderText(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.govuk-fieldset__heading');
  }

  breachOfContractOption(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#breachOfContract');
  }

  discriminationOption(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#discrimination');
  }

  payRelatedOption(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#payRelatedClaim');
  }

  usernameTextField(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#username');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completePreloginDraft(workPostCode, repOption, acasOption) {
    await this.makeClaimHeader().should('be.visible');
    await this.startNowButton().click();
    this.beforeYouContinueHeader().should('be.visible');
    this.beforeYouContinueHeader().should('contain', 'Before you continue');
    this.continueToPostCode().click();
    this.postcodeTextHeader().should('be.visible');
    this.postcodeTextFeild().clear();
    this.postcodeTextFeild().type(workPostCode);
    this.continueToNextPageButton().should('be.visible');
    this.continueToNextPageButton().click();
    switch (repOption) {
      case 'Claimant Representing Self':
        this.representingSelf().check();
        this.representingSelf().should('be.checked');
        this.continueToNextPageButton().click();
        this.makingYourClaimCheckBox().check();
        this.makingYourClaimCheckBox().should('be.checked');
        break;
      case 'Make cliam for someone':
        this.actForSomeoneElse().check();
        this.actForSomeoneElse().should('be.checked');
        break;
      case 'Legal representative for single applicant':
        this.legalRepSingleClaimant().check();
        this.legalRepSingleClaimant().should('be.checked');
        break;
      case 'Legal rep for group application':
        this.legalRepGroupClaim().check();
        this.legalRepGroupClaim().should('be.checked');
        break;

      default:
        throw new Error('... check you options or try again');
    }
    this.continueToNextPageButton().click();
    this.acasHeaderText().should('be.visible');
    this.yesToAcas().scrollIntoView();
    switch (acasOption) {
      case 'Yes':
        this.yesToAcas().check();
        this.yesToAcas().should('be.checked');
        break;
      case 'No':
        this.noToAcas().check();
        this.noToAcas().should('be.checked');
        break;

      default:
        throw new Error('... you need to select either you or no to proceed');
    }
    this.continueToNextPageButton().click();
    this.claimTypeHeaderText().should('contain', 'What type of claim are you making?');
    this.breachOfContractOption().check();
    this.breachOfContractOption().should('be.checked');
    this.discriminationOption().check();
    this.discriminationOption().should('be.checked');
    this.payRelatedOption().check();
    this.payRelatedOption().should('be.checked');
    this.continueToNextPageButton().click();
    this.usernameTextField().should('be.visible');
  }

}

/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

export default LandingPage;
