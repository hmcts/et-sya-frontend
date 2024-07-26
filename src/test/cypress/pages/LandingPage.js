/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

class LandingPage {
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */

  startNowButton() {
    return cy.get('.govuk-button--start').first();
  }

  makeClaimHeader() {
    return cy.get('.govuk-heading-xl');
  }

  beforeYouContinueHeader() {
    return cy.get('.govuk-heading-l');
  }

  continueToPostCode() {
    return cy.get('[href="/work-postcode"]');
  }

  postcodeTextHeader() {
    return cy.get('.govuk-heading-xl');
  }

  postcodeTextFeild() {
    return cy.get('#workPostcode');
  }

  continueToNextPageButton() {
    return cy.get('#main-form-submit');
  }

  representingSelf() {
    return cy.get('#lip-or-representative');
  }

  actForSomeoneElse() {
    return cy.get('#lip-or-representative-2');
  }

  legalRepSingleClaimant() {
    return cy.get('#lip-or-representative-3');
  }

  legalRepGroupClaim() {
    return cy.get('#lip-or-representative-4');
  }

  makingYourClaimCheckBox() {
    return cy.get('#single-or-multiple-claim');
  }

  acasHeaderText() {
    return cy.get('.govuk-heading-xl');
  }

  yesToAcas() {
    return cy.get('#acas-multiple');
  }

  noToAcas() {
    return cy.get('#acas-multiple-2');
  }

  claimTypeHeaderText() {
    return cy.get('.govuk-fieldset__heading');
  }

  breachOfContractOption() {
    return cy.get('#breachOfContract');
  }

  discriminationOption() {
    return cy.get('#discrimination');
  }

  payRelatedOption() {
    return cy.get('#payRelatedClaim');
  }

  usernameTextField() {
    return cy.get('#username');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completePreloginDraft(workPostCode, repOption, acasOption) {
    //await this.startNowButton().should('be.visible');
    this.startNowButton().click();
    cy.wait(5000);
    //this.beforeYouContinueHeader().should('be.visible');
    //this.beforeYouContinueHeader().should('contain', 'Before you continue');
    this.continueToPostCode().click();
    //this.postcodeTextHeader().should('be.visible');
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
    //this.usernameTextField().should('be.visible');
  }
}

/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

export default LandingPage;
