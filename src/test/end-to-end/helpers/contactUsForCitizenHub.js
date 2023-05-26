const { I } = inject();
function verifyContactUs() {
  I.see('Call one of our Employment Tribunal customer contact centres. They cannot give you legal advice.');
  I.see('Telephone: 0300 123 1024');
  I.seeElement('[class="govuk-details__text"]');
  I.seeElement('[href="https://www.gov.uk/call-charges"]');
}

module.exports = { verifyContactUs };
