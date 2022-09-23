'use strict';
const contactUs = require('../../helpers/contactUs.js');

const whatTribunalRecommendationConfig = require('./whatTribunalReccomendation.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.see('What tribunal recommendation would');
  I.see('you like to make?');
  I.see('What is a tribunal recommendation?');
  I.see('Tell us what action you’d like a tribunal to recommend your respondents take to');
  I.see('reduce the impact of any discrimination which has occurred.');

  I.click(whatTribunalRecommendationConfig.what_is_a_tribunal_recommendation);
  I.wait(1);
  I.see('If your employer is found to have discriminated against you, a tribunal can');
  I.see('make a recommendation that the respondent take specific steps to reduce');
  I.see('the effect of the discrimination on you');

  I.fillField(
    whatTribunalRecommendationConfig.tribunal_recommendation_request,
    'Discrimination, Dismissal and Pay Cut.'
  );

  I.click(whatTribunalRecommendationConfig.contact_us);
  I.wait(1);
  await contactUs.verifyContactUs();

  I.click('Save and continue');
};
