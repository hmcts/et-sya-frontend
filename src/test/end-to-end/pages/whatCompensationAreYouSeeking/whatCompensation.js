'use strict';
const contactUs = require('../../helpers/contactUs.js');

const whatCompensationAreYouSeekingConfig = require('./whatCompensationAreYouSeeking.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.see('What compensation are you seeking? (optional)');
  I.see('Compensation - what can a tribunal award?');
  I.see('Try to set out all compensation you’re claiming for, and provide a total if possible');
  I.see('Enter the total compensation amount you are requesting');

  I.click(whatCompensationAreYouSeekingConfig.compensation_what_can_a_tribunal_award);
  I.wait(1);
  I.see("If a tribunal decides you've been unfairly dismissed, you'll normally receive");
  I.see('compensation which is made up of:');
  I.see('a basic award - fixed sum worked out using a standard formula');
  I.see('a compensatory award - compensation for the actual money you lost');
  I.see('due to your dismissal, or which you expect to lose in future because of');
  I.see('your dismissal');
  I.see('Compensation can be reduced for various reasons and a tribunal will tell you');
  I.see('more about this if it applies in your specific circumstances.');
  I.see('In disciplinary or grievance cases, you may be entitled to an increased award');
  I.see('if an employer fails to follow the guidance set out in the Acas Code of');
  I.see('Practice on disciplinary and grievance procedures.');
  I.see("Similarly, awards can be reduced if a tribunal decides you've failed to follow");
  I.see('the guidance set out in the Acas Code of Practice on disciplinary and griev');
  I.see('ance procedures.');
  I.see('In certain claims, such as those involving discrimination, a tribunal may com');
  I.see("pensate you for 'injury to feelings' (individual hurt and distress you may have");
  I.see('suffered) in addition to compensation for financial loss.');

  I.fillField(whatCompensationAreYouSeekingConfig.compensation_outcome, 'Discrimination, Dismissal and Pay Cut.');
  I.fillField(whatCompensationAreYouSeekingConfig.compensation_amount, '1000.00');

  I.click(whatCompensationAreYouSeekingConfig.contact_us);
  I.wait(1);
  await contactUs.verifyContactUs();

  I.click('Save and continue');
};
