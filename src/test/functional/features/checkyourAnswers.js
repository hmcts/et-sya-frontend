Feature('ET check your answers');
const test_url = '/check-your-answers';
const { I } = inject();

Scenario('Verify check your answers page', () => {
  I.amOnPage(test_url);
  I.see('Check your answers');

  I.see('Type of claim');
  I.click('(//a[@href="/type-of-claim"])');
  I.executeScript('window.history.back();');

  I.see('Date of birth');
  I.click('(//a[@href="/dob-details"])');
  I.executeScript('window.history.back();');

  I.see('Sex');
  I.click('(//a[@href="/gender-details"])');
  I.executeScript('window.history.back();');

  I.see('Gender same as registered birth sex');
  I.click('(//a[@href="/gender-details"])');
  I.executeScript('window.history.back();');

  I.see('Preferred title');
  I.click('(//a[@href="/gender-details"])');
  I.executeScript('window.history.back();');

  I.see('Contact or home address');
  I.click('(//a[@href="/address-details"])');
  I.executeScript('window.history.back();');

  I.see('UK telephone number');
  I.click('(//a[@href="/telephone-number"])');
  I.executeScript('window.history.back();');

  I.see('Disability or assistance needed');

  I.see('Update preference');
  I.click('(//a[@href="/how-would-you-like-to-be-updated-about-your-claim"])');
  I.executeScript('window.history.back();');

  I.see('Did you work for the organisation or person');
  I.click('(//a[@href="/past-employer"])');
  I.executeScript('window.history.back();');

  I.see('Still working for the organisation or person');
  I.click('(//a[@href="/are-you-still-working"])');
  I.executeScript('window.history.back();');

  I.see('Job title');
  I.click('(//a[@href="/job-title"])');
  I.executeScript('window.history.back();');

  I.see('Start date');
  I.click('(//a[@href="/start-date"])');
  I.executeScript('window.history.back();');

  I.see('Notice period');
  I.click('(//a[@href="/notice-end"])');
  I.executeScript('window.history.back();');

  I.see('Average weekly hours');
  I.click('(//a[@href="/average-weekly-hours"])');
  I.executeScript('window.history.back();');

  I.see('Pay BEFORE tax');
  I.click('(//a[@href="/pay"])');
  I.executeScript('window.history.back();');

  I.see('Pay AFTER tax');
  I.click('(//a[@href="/pay"])');
  I.executeScript('window.history.back();');

  I.see('Pension scheme');
  I.click('(//a[@href="/pension"])');
  I.executeScript('window.history.back();');

  I.see('Benefits');
  I.click('(//a[@href="/benefits"])');
  I.executeScript('window.history.back();');

  I.see('Organisation or person');

  I.see('Acas number');

  I.see('Acas exemption');
  I.click('(//a[@href="/do-you-have-a-valid-no-acas-reason"])');
  I.executeScript('window.history.back();');

  I.see('Name');

  I.see('UK telephone number');

  I.see('Registered or head office address');

  I.see('Work address');
  I.click('(//a[@href="/do-you-have-a-valid-no-acas-reason"])');
  I.executeScript('window.history.back();');

  I.see('Summary of claim');
  I.click('(//a[@href="/steps-to-making-your-claim"])');
  I.executeScript('window.history.back();');

  I.see('File uploads');
  I.click('(//a[@href="/summarise-what-happened"])');
  I.executeScript('window.history.back();');

  I.see('What you want');
  I.click('(//a[@href="/what-you-want-from-your-claim"])');
  I.executeScript('window.history.back();');

  I.click('#main-form-submit');
  I.see('Your claim has been submitted');
})
  .tag('@RET-1236')
  .tag(' @RET-BAT');
