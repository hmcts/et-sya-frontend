Feature('Employee got a new job');
const testUrl = '/new-job';
const { I } = inject();

Scenario('Employee details when he got a new job', () => {
  I.amOnPage(testUrl);
  I.see('Have you got a new job?');
  I.click('#main-form-submit');

  I.see('New job start date');
  I.click('#main-form-submit');

  I.see('New job pay BEFORE tax');
  I.click('#main-form-submit');
})
  .tag('@RET-1170')
  .tag(' @RET-BAT');
