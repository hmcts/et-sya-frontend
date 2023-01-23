const { I } = inject();

module.exports = {
  processPreLoginPagesForTheDraftApplication() {
    this.startDraftApplication();
    this.processBeforeYourContinuePage();
    this.processWhatsThePostCodeYouHaveWorkedForPage();
    this.processAreYouMakingTheClaimForYourselfPage();
    this.processAreYouMakingTheClaimOnYourOwnPage();
    this.processDoYouHaveAnACASEarlyConciliation();
    this.processWhatKindOfClaimAreYouMaking();
  },

  startDraftApplication() {
    I.amOnPage('/');
    I.see('Make a claim to an employment tribunal');
    I.click('Cymraeg');
    I.waitForText('Welsh Translation required', 30);
    I.see('Cysylltu â ni');
    I.click('.govuk-button--start');
  },

  processBeforeYourContinuePage() {
    I.waitForText('Bydd gennych gyfle i ddarparu gwybodaeth fanwl am eich hawli', 30);
    I.click('Parhau');
  },

  processWhatsThePostCodeYouHaveWorkedForPage() {
    I.waitForText('Beth yw cod post', 30);
    I.fillField('#workPostcode', 'LS9 6EP');
    I.click('Parhau');
  },

  processAreYouMakingTheClaimForYourselfPage() {
    I.waitForText('Cynrychiolydd yw rhywun sy’n gallu gweithredu ar eich rhan i gwblhau’r', 30);
    I.checkOption('input[id=lip-or-representative]');
    I.click('Parhau');
  },

  processAreYouMakingTheClaimOnYourOwnPage() {
    I.waitForText('Gallwch wneud hawliad i dribiwnlys cyflogaeth ar eich pen eich hun os mai', 30);
    I.checkOption('input[id=single-or-multiple-claim]');
    I.click('Parhau');
  },

  processDoYouHaveAnACASEarlyConciliation() {
    I.waitForText('I wneud hawliad, fel arfer bydd angen i chi gael tystysgrif cymodi cynnar', 30);
    I.checkOption('input[id=acas-multiple]');
    I.click('Parhau');
  },

  processWhatKindOfClaimAreYouMaking() {
    I.waitForText('Pa fath o hawliad ydych chi’n ei wneud?', 30);
    I.checkOption('input[value=discrimination]');
    I.checkOption('input[value=whistleBlowing]');
    I.click('Parhau');
  },
};
