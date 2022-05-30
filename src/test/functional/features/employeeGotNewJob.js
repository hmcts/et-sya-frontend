Feature('Employee got a new job');
const testUrl = '/new-job';
const { I } = inject();

Scenario('Employee details when he got a new job', () => {
  I.amOnPage(testUrl);
  I.see('Have you got a new job?');

  I.checkOption('input[id=new-job]');
  I.click('#main-form-submit');
})
  .tag('@RET-1170')
  .tag(' @RET-BAT');
