const { I } = inject();
function verifyContactUs() {
  I.click('.govuk-details__summary-text');
  I.waitForElement('[href="https://www.gov.uk/call-charges"]', 2);
  I.see('Call one of our Employment Tribunal customer contact centres. They cannot give you legal advice.');
  I.see('Telephone: 0300 323 0196');
  I.seeElement('[class="govuk-details__text"]');
  I.seeElement('[href="https://www.gov.uk/call-charges"]');
}

module.exports = { verifyContactUs };
