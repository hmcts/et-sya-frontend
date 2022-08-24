const { I } = inject();
async function initialPageFlow() {
  I.amOnPage('/');
  I.see('Make a claim to an employment tribunal');
  I.click('Start now');
  I.see('Before you continue');
  I.click('Continue');
  I.seeElement('#workPostcode');
  I.fillField('#workPostcode', 'G2 1DU');
  I.click('Continue');
}

async function createSingleMyselfCase() {
  /* Journey for creating a case for yourself
  includes:
  * with ACAS certificate
  * type of claim = discrimination
  */
  await initialPageFlow();
  //representing yourself
  I.checkOption('input[id=lip-or-representative]');
  I.click('Continue');
  //Claiming on my own
  I.see('Are you making a claim on your own or with others?');
  I.checkOption('input[id=single-or-multiple-claim]');
  I.click('Continue');
  //Yes Acas certificate
  I.checkOption('input[id=acas-multiple]');
  I.click('Continue');
  //Type of claim = discrimination
  I.checkOption('input[value=discrimination]');
  I.checkOption('input[value=whistleBlowing]');
  I.click('#main-form-submit');
}

module.exports = { initialPageFlow, createSingleMyselfCase };
