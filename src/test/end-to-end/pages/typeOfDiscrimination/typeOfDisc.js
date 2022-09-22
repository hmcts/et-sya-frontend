'use strict';
const contactUs = require('../../helpers/contactUs.js');

const typeOfDiscriminationConfig = require('./typeOfDiscrimination.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.see('What type of discrimination are you');
  I.see('claiming?');
  I.see('What is discrimination?');
  I.see('Select all that apply.');
  I.see('Age');
  I.see('Disability');
  I.see('Ethnicity');
  I.see('Gender reassignment');
  I.see('Marriage or civil partnership');
  I.see('Pregnancy or maternity');
  I.see('Race');
  I.see('Religion or belief');
  I.see('Sex');
  I.see('Sexual orientation');

  I.click(typeOfDiscriminationConfig.what_is_discrimination);
  I.wait(1);
  I.see(
    "Discrimination is when you're treated unfairly and the treatment is related to any of the protected characteristics"
  );
  I.see('from the 2010 Equality Act. You have rights at work if you have experienced discrimination.');
  I.see('See the GOV.UK guidance (opens in new tab) for further information on protected characteristics and your');
  I.see('workplace rights.');

  I.click(typeOfDiscriminationConfig.contact_us);
  I.wait(1);
  await contactUs.verifyContactUs();

  I.checkOption(typeOfDiscriminationConfig.age);
  I.checkOption(typeOfDiscriminationConfig.disability);
  I.checkOption(typeOfDiscriminationConfig.ethinicity);
  I.checkOption(typeOfDiscriminationConfig.gender_reassignment);
  I.checkOption(typeOfDiscriminationConfig.marriage_or_civil_partnership);
  I.checkOption(typeOfDiscriminationConfig.pregnancy_or_maternity);
  I.checkOption(typeOfDiscriminationConfig.race);
  I.checkOption(typeOfDiscriminationConfig.religion_or_belief);
  I.checkOption(typeOfDiscriminationConfig.sex);
  I.checkOption(typeOfDiscriminationConfig.sexual_orientation);

  I.click('Save and continue');
};
