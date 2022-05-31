Feature('ET Place of Work');
const testUrl = '/place-of-work';
const loginIdam = require('../authUser/loginIdam.js');
const data = require('../data.json');
const { I } = inject();
Scenario('ET Place of work flow: Valid post code with address list', () => {
  I.amOnPage(testUrl);

  loginIdam.signInWithCredentials(data.signIn.username, data.signIn.password);
  I.wait(3);

  I.amOnPage(testUrl);

  I.seeElement('#findAddressButton');
  I.click('#findAddressButton');
  I.see('A postcode is required');
  I.fillField('#postcode', 'BH1 1AJ');
  I.click('#findAddressButton');
  I.dontSeeElement('#main-form-submit');
  I.see('Several addresses found...');
  I.amOnPage('/logout');
  //the next page is yet to be deployed
}).tag('@RET-943');

Scenario('ET Place of work flow: Invalid Postcode ', () => {
  I.amOnPage(testUrl);

  loginIdam.signInWithCredentials(data.signIn.username, data.signIn.password);
  I.wait(3);

  I.amOnPage(testUrl);
  I.seeElement('#findAddressButton');
  I.seeElement('#findAddressButton');
  I.fillField('#postcode', 'BH1');
  I.click('#findAddressButton');
  I.see('You have not entered a valid UK postcode. Enter a valid UK postcode before continuing.');
  I.amOnPage('/logout');
})
  .tag('@RET-943')
  .tag(' @RET-BAT');

Scenario('ET Place of work flow: No post code ', () => {
  I.amOnPage(testUrl);

  loginIdam.signInWithCredentials(data.signIn.username, data.signIn.password);
  I.wait(3);

  I.amOnPage(testUrl);
  I.seeElement('#findAddressButton');
  I.click('#findAddressButton');
  I.see('A postcode is required');
  I.amOnPage('/logout');
}).tag('@RET-943');

Scenario('ET Place of work flow: Manual Entry', () => {
  I.amOnPage(testUrl);

  loginIdam.signInWithCredentials(data.signIn.username, data.signIn.password);
  I.wait(3);

  I.amOnPage(testUrl);
  I.seeElement('#findAddressButton');
  I.seeElement('#manualAddress');
  I.click('#manualAddress');
  I.fillField('#address1', 'LongHouse');
  I.fillField('#address2', 'LongStreet');
  I.fillField('#addressTown', 'LongTown');
  I.fillField('#addressCounty', 'LongCounty');
  I.fillField('#addressPostcode', 'BH1 1AJ');
  I.click('#main-form-submit');
  I.amOnPage('/logout');
})
  .tag('@RET-943')
  .tag(' @RET-BAT');
