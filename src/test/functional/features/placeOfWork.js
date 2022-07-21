Feature('ET Place of Work');
const testUrl = '/place-of-work';
const authPage = require('./authPage.js');
const { I } = inject();
Scenario('ET Place of work flow: Valid post code with address list', () => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);

  I.seeElement('#findAddressButton');
  I.click('#findAddressButton');
  I.see('A postcode is required');
  I.fillField('#postcode', 'BH1 1AJ');
  I.click('#findAddressButton');
  I.dontSeeElement('#main-form-submit');
  I.see('Several addresses found...');
  authPage.logout();
  //the next page is yet to be deployed
}).tag('@RET-943');

Scenario('ET Place of work flow: Invalid Postcode ', () => {
  I.amOnPage(testUrl);
  authPage.login();

  I.amOnPage(testUrl);
  I.seeElement('#findAddressButton');
  I.seeElement('#findAddressButton');
  I.fillField('#postcode', 'BH1');
  I.click('#findAddressButton');
  I.see('You have not entered a valid UK postcode. Enter a valid UK postcode before continuing.');
  authPage.logout();
})
  .tag('@RET-943')
  .tag(' @RET-BAT');

Scenario('ET Place of work flow: No post code ', () => {
  I.amOnPage(testUrl);
  authPage.login();

  I.amOnPage(testUrl);
  I.seeElement('#findAddressButton');
  I.click('#findAddressButton');
  I.see('A postcode is required');
  authPage.logout();
}).tag('@RET-943');

Scenario('ET Place of work flow: Manual Entry', () => {
  I.amOnPage(testUrl);
  authPage.login();

  I.amOnPage(testUrl);
  I.seeElement('#findAddressButton');
  I.seeElement('#manualAddress');
  I.click('#manualAddress');
  I.fillField('#address1', 'LongHouse');
  I.fillField('#address2', 'LongStreet');
  I.fillField('#addressTown', 'LongTown');
  I.fillField('#addressCountry', 'LongCountry');
  I.fillField('#addressPostcode', 'BH1 1AJ');
  I.click('#main-form-submit');
  authPage.logout();
})
  .tag('@RET-943')
  .tag(' @RET-BAT');
