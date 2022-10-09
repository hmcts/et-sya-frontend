const { I } = inject();
async function verifyContactUs() {
  I.see('Telephone:');
  I.see('0300 123 1024');
  I.see('Telephone:');
  I.see('0300 303 5176 (Welsh language)');
  I.see('Telephone:');
  I.see('0300 790 6234 (Scotland)');
  I.see('Telephone:');
  I.see('18001 0300 123 1024 (England and Wales)');
  I.see('Telephone:');
  I.see('18001 0300 790 6234 (Scotland)');
  I.see('Monday to Friday, 9am to 5pm');
  I.see('Find out about call charges');
}

async function clickSubmit() {
  await I.click("//a[@id='main-form-submit']");
}
module.exports = { verifyContactUs, clickSubmit };
