Feature('ET claim for someone else');
const commonFlow = require('./commonFlow.js');
const { I } = inject();
const waitSeconds = 2;

Scenario('Verify ET claim for someone else', async () => {
  commonFlow.initialPageFlow();
  I.wait(waitSeconds);
  I.checkOption('input[id=lip-or-representative-2]');
  I.click('Continue');
});
