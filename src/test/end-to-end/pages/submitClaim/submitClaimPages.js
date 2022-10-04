'use strict';

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  //user clicks check your answers link
  I.click('[href="/pcq"]');
  //user will see the equality and diversity question
  I.see('Equality and diversity questions');
  I.click(['class=govuk-button.govuk-button--secondary']);
  //check user is on the check your answers page
  I.waitForElement('#main-content');
  I.see('Check your answers');
  //submits claim
  I.waitForElement('#main-form-submit');
  I.click('#main-form-submit');
  I.wait(8);
  I.see('Your claim has been submitted');
};
