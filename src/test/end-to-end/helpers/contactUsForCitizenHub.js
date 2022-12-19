const { I } = inject();
function verifyContactUs() {
  I.see('Call the Employment Tribunal customer contact centre');
  I.see(
    'Call if you have any questions about your claim. They cannot give you legal advice or process any updates to your case.'
  );
  I.see('Use the contact forms to make a request or to provide something for the tribunal.');

  I.see('England & Wales');
  I.see('Telephone: 0300 123 1024');
  I.see('Textphone: 18001 0300 123 1024');

  I.see('Welsh language');
  I.see('Telephone: 0300 303 5176');

  I.see('Scotland');
  I.see('Telephone: 0300 790 6234');
  I.see('Textphone: 18001 0300 790 6234');
  I.see('Monday to Thursday, 8.30am to 5pm.');
  I.see('Friday, 8.30am to 4pm.');
  I.see('The centre does not open on bank holidays.');
  I.see('Find out about call charges (opens in new tab)');
}

module.exports = { verifyContactUs };
