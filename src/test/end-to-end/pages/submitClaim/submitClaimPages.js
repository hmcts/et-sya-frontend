'use strict';

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;

  //user clicks check your answers link
  I.click('[href="/pcq"]');

  //User will see the equality and diversity Pages
  I.see('Equality and diversity questions');
  I.click("//button[contains(text(),'Continue to the questions')]");

  //Main Language Page
  I.see('What is your main language?');
  I.see('English or Welsh');
  I.see('Other');
  I.see('Prefer not to say');
  I.see('Why we are asking this question');
  I.click("//span[contains(.,'Why we are asking this question')]");
  I.see(
    'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
  );
  I.checkOption("//input[@value='0']"); //Prefer Not to Say Option
  I.click('Continue');

  //Best Describe Yourself Page
  I.see('Which of the following best describes how you think of yourself?');

  I.click("//span[contains(.,'Why we are asking this question')]");
  I.see(
    'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
  );
  I.checkOption("//input[@value='0']"); //Prefer Not to Say Option
  I.click('Continue');

  //Are you married or in a Civil Partnership
  I.see('Are you married or in a legally registered civil partnership?');
  I.click("//span[contains(.,'Why we are asking this question')]");
  I.see(
    'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
  );
  I.checkOption("//input[@value='0']"); //Prefer Not to Say Option
  I.click('Continue');

  //Ethnic Group Page
  I.see('What is your ethnic group?');
  I.click("//span[contains(.,'Why we are asking this question')]");
  I.see(
    'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
  );
  I.checkOption("//input[@value='0']"); //Prefer Not to Say Option
  I.click('Continue');

  //Religion Page
  I.see('What is your religion?');
  I.click("//span[contains(.,'Why we are asking this question')]");
  I.see(
    'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
  );
  I.checkOption("//input[@value='0']"); //Prefer Not to Say Option
  I.click('Continue');

  //Physical or Mental Conditions Page
  I.see(
    'Do you have any physical or mental health conditions or illnesses lasting or expected to last 12 months or more?'
  );
  I.click("//span[contains(.,'Why we are asking this question')]");
  I.see(
    'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
  );
  I.checkOption("//input[@value='0']"); //Prefer Not to Say Option
  I.click('Continue');

  //Pregnant Page
  I.see('Are you pregnant or have you been pregnant in the last year?');
  I.click("//span[contains(.,'Why we are asking this question')]");
  I.see(
    'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
  );
  I.checkOption("//input[@value='0']"); //Prefer Not to Say Option
  I.click('Continue');

  //You have answered the equality questions
  I.see('You have answered the equality questions');
  I.see('The next steps are to check your claim details.');
  I.click('Continue to the next steps');
};
