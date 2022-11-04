const { I } = inject();

module.exports = {
  processClaimDetails() {
    this.clickClaimDetailsLink();
    this.selectClaimTypeDiscrimination();
    this.describeWhatHappened();
    this.tellUsWhatYouWant();
    this.compensation();
    this.tribunalRecommendation();
    this.whistleBlowingClaims();
    this.claimDetailsCheck();
  },
  //clicks on the claim details link
  clickClaimDetailsLink() {
    I.click('[href="/claim-type-discrimination"]');
  },
  selectClaimTypeDiscrimination() {
    I.waitForText('Welsh Translation required', 30);
    I.checkOption('#age');
    I.checkOption('#disability');
    I.click('Cadw a pharhau');
  },
  describeWhatHappened() {
    I.waitForText('Welsh translation required', 30);
    I.fillField('#claim-summary-text', 'Discrimination, Dismissal and Pay Cut.');
    I.click('Cadw a pharhau');
  },
  tellUsWhatYouWant() {
    I.waitForText('Welsh translation required', 30);
    I.checkOption('#compensationOnly');
    I.checkOption('#tribunalRecommendation');
    I.checkOption('#oldJob');
    I.click('Cadw a pharhau');
  },
  compensation() {
    I.waitForText('Welsh translation required', 30);
    I.fillField('#compensationOutcome', 'Seeking months wage and job back');
    I.fillField('#compensation-amount', '2000');
    I.click('Cadw a pharhau');
  },
  tribunalRecommendation() {
    I.waitForText('Welsh translation required', 30);
    I.fillField('#tribunalRecommendationRequest', 'Get Job back and my boss to say sorry');
    I.click('Cadw a pharhau');
  },
  whistleBlowingClaims() {
    I.waitForText('Hawliadau chwythu’r chwiban (dewisol)', 30);
    I.checkOption('#whistleblowing-claim');
    I.waitForElement('#whistleblowing-entity-name');
    I.fillField('#whistleblowing-entity-name', 'Rupert Regulator');
    I.click('Cadw a pharhau');
  },

  claimDetailsCheck() {
    I.waitForText('Ydych chi wedi cwblhau’r adran hon?\n', 30);
    I.checkOption('#claim-details-check');
    I.click('Cadw a pharhau');
  },
};
