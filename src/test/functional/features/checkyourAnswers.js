Feature('ET check your answers');
const test_url = '/check-your-answers';
const loginIdam = require('../authUser/loginIdam.js');
const data = require('../data.json');
const { I } = inject();

Scenario('Verify check your answers page', () => {
  I.amOnPage(test_url);
  loginIdam.signInWithCredentials(data.signIn.username, data.signIn.password);
  I.wait(3);
  I.amOnPage(test_url);
  I.see('Check your answers');

  I.see('Type of claim');
  I.seeElement('(//a[@href="/type-of-claim"])');

  I.see('Date of birth');
  I.seeElement('(//a[@href="/dob-details"])');

  I.see('Sex');
  I.seeElement('(//a[@href="/gender-details"])');

  I.see('Gender same as registered birth sex');
  I.seeElement('(//a[@href="/gender-details"])');

  I.see('Preferred title');
  I.seeElement('(//a[@href="/gender-details"])');

  I.see('Contact or home address');
  I.seeElement('(//a[@href="/address-details"])');

  I.see('UK telephone number');
  I.seeElement('(//a[@href="/telephone-number"])');

  I.see('Disability or assistance needed');

  I.see('Update preference');
  I.seeElement('(//a[@href="/how-would-you-like-to-be-updated-about-your-claim"])');

  I.see('Did you work for the organisation or person');
  I.seeElement('(//a[@href="/past-employer"])');

  I.see('Still working for the organisation or person');
  I.seeElement('(//a[@href="/are-you-still-working"])');

  I.see('Job title');
  I.seeElement('(//a[@href="/job-title"])');

  I.see('Start date');
  I.seeElement('(//a[@href="/start-date"])');

  I.see('Notice period');
  I.seeElement('(//a[@href="/notice-end"])');

  I.see('Average weekly hours');
  I.seeElement('(//a[@href="/average-weekly-hours"])');

  I.see('Pay BEFORE tax');
  I.seeElement('(//a[@href="/pay"])');

  I.see('Pay AFTER tax');
  I.seeElement('(//a[@href="/pay"])');

  I.see('Pension scheme');
  I.seeElement('(//a[@href="/pension"])');

  I.see('Benefits');
  I.seeElement('(//a[@href="/benefits"])');

  I.see('Organisation or person');

  I.see('Acas number');

  I.see('Acas exemption');
  I.seeElement('(//a[@href="/do-you-have-a-valid-no-acas-reason"])');

  I.see('Name');

  I.see('UK telephone number');

  I.see('Registered or head office address');

  I.see('Work address');
  I.seeElement('(//a[@href="/do-you-have-a-valid-no-acas-reason"])');

  I.see('Summary of claim');
  I.seeElement('(//a[@href="/steps-to-making-your-claim"])');

  I.see('File uploads');
  I.seeElement('(//a[@href="/summarise-what-happened"])');

  I.see('What you want');
  I.seeElement('(//a[@href="/what-you-want-from-your-claim"])');

  I.amOnPage('/logout');
})
  .tag('@RET-1236')
  .tag(' @RET-BAT');
