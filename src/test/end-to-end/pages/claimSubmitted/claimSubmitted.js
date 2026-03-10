'use strict';
const testConfig = require('../../config');
module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;

  //Application Details Section
  await I.waitForVisible(
    "//a[contains(text(),'Complete this short survey')]",
    testConfig.TestWaitForVisibilityTimeLimit
  );
  I.see('Your claim has been submitted');
  I.see('What happens next');
  I.see('Submission details');
  I.see('Submission reference');
  I.see('Claim submitted');
  const date = new Date();
  const formattedDate = date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  I.see(formattedDate);
  I.see('Download your claim');
  I.see('Save a copy of your claim');
};
