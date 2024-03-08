const { I } = inject();
async function verifyContactUs() {
  I.see('Telephone:');
  I.see('0300 323 0196');
  I.see('Telephone:');
  I.see('0300 303 5176 (Welsh language)');
  I.see('Telephone:');
  I.see('0300 790 6234 (Scotland)');
  I.see('Monday to Friday, 9am to 5pm');
  I.see('Find out about call charges');
}

module.exports = { verifyContactUs };
