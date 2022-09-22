'use strict';
const contactUs = require('../../helpers/contactUs.js');

const ifClaimWasSuccessfullConfig = require('./ifClaimWasSuccessful.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.see('What do you want if your claim is successful?');
  I.see('Compensation - what can a tribunal award?');
  I.see('What is a tribunal recommendation?');
  I.see('Select all that apply.');
  I.see('Compensation only');
  I.see('You’ll be asked to provide an estimate of total compensation');
  I.see('If claiming discrimination, a tribunal recommendation');
  I.see('You’ll be asked to describe your request to the tribunal');
  I.see('If claiming unfair dismissal, to get your old job back and compensation');
  I.see('If claiming unfair dismissal, to get another job with the same employ');
  I.see('er or associated employer and compensation (re-engagement)');

  I.click(ifClaimWasSuccessfullConfig.compensation_what_can_a_tribunal_award);
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

  I.click(ifClaimWasSuccessfullConfig.what_is_a_tribunal_recommendation);
  I.wait(1);
  I.see('If your employer is found to have discriminated against you, a tribunal can');
  I.see('make a recommendation that the respondent take specific steps to reduce');
  I.see('the effect of the discrimination on you');

  I.checkOption(ifClaimWasSuccessfullConfig.compensation_only);
  I.checkOption(ifClaimWasSuccessfullConfig.tribunal_recommendation);
  I.checkOption(ifClaimWasSuccessfullConfig.get_your_old_job_back);
  I.checkOption(ifClaimWasSuccessfullConfig.get_another_job);

  I.click(ifClaimWasSuccessfullConfig.contact_us);
  I.wait(1);
  await contactUs.verifyContactUs();

  I.click('Save and continue');
};
