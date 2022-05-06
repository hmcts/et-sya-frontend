Feature('ET Homepage');
const testConfig = require('../config.js');

const commonFlow = require('./commonFlow.js');
const { I } = inject();

Scenario('ET gender details page', async () => {
  I.amOnPage(testConfig.testUrl + '/gender-details');
  I.see('Sex and gender identity');
});

Scenario('ET homepage verify cached configuration on a new tab', () => {
  commonFlow.initialPageFlow();
  I.checkOption('input[id=lip-or-representative]');
  I.seeCheckboxIsChecked('input[id=lip-or-representative]');
  I.openNewTab();
  I.amOnPage('/lip-or-representative');
  I.seeInCurrentUrl('/lip-or-representative');
  I.see('I’m representing myself and making my own claim');
  I.dontSeeCheckboxIsChecked('claimantRepresentedQuestion');
}).tag('@RET-1014');
