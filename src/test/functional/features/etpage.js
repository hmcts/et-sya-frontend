Feature('ET Homepage');
const commonFlow = require('./commonFlow.js');
const { I } = inject();

Scenario('ET homepage verify cached configuration on a new tab', () => {
  commonFlow.initialPageFlow();
  I.seeElement('#lip-or-representative');
  I.checkOption('input[id=lip-or-representative]');
  I.seeCheckboxIsChecked('input[id=lip-or-representative]');
  I.openNewTab();
  I.amOnPage('/lip-or-representative');
  I.seeInCurrentUrl('/lip-or-representative');
  I.see('I’m representing myself and making my own claim');
  I.dontSeeCheckboxIsChecked('claimantRepresentedQuestion');
}).tag('@RET-1014');
