Feature('ET claim for someone else');
const commonFlow = require('./commonFlow.js');
const { I } = inject();

Scenario('Verify ET claim for someone else', async () => {
  commonFlow.initialPageFlow();
  I.seeElement('#lip-or-representative-2');
  I.checkOption('input[id=lip-or-representative-2]');
  I.click('Continue');
});
