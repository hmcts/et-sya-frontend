const { I } = inject();

async function verifyMakeAClaimToAnEmploymentTribunal() {
  I.see(
    'Use this service to make claims to an employment tribunal when an employer, potential employer, trade union or'
  );
  I.see('person at work has treated another person unlawfully.');
  I.see(
    "During the employment tribunal process the organisations or people you're making a claim against are known as"
  );
  I.see('‘respondents’.');
  I.see('To make a claim you need to contact Acas and get an ‘Early conciliation certificate’ from them or give us a');
  I.see('valid reason why you do not have one.');
  I.see('If you do not have a certificate or a reason you need to contact Acas.');
  I.see(
    'You do not have to make your claim in one go. You can save and return to it at any time before you submit it.'
  );
  I.see('Claims usually have to be made within 3 months of employment ending or problems happening. If a claim is');
  I.see('late, you must explain why. A judge will then decide what happens next.');

  I.see('Have you already started a claim?');
  I.see('Return to an existing claim');
  I.see('Help using the service');
  I.see('Call one of our Employment Tribunal customer contact centres. They cannot give you legal advice.');
  I.see('Telephone: 0300 123 1024');
  I.see('Telephone: 0300 303 5176 (Welsh language)');
  I.see('Telephone: 0300 790 6234 (Scotland)');
  I.see('Textphone: 18001 0300 123 1024 (England and Wales)');
  I.see('Textphone: 18001 0300 790 6234 (Scotland)');
  I.see('Monday to Friday, 9am to 5pm');
  I.see('Find out about call charges');
}

async function verifyBeforeYouContinueGuidanceText() {
  I.see('You’ll have the opportunity to provide detailed information about your claim, but you might want to have');
  I.see('the minimum required information to hand:');
  I.see('The name and address of each claimant (you or the person you’re claiming for)');
  I.see('Name and address of each respondent you’re making the claim against - this can be found in any');
  I.see('letter you received offering you the job, a contract of employment or payslips');
  I.see('Certificate number from the Acas early conciliation process for each respondent, or explain why you');
  I.see('do not have one');
  I.see('You do not have to complete your claim in one session. You can save your progress and return to the claim');
  I.see('at any time before submitting.');
}

async function verifyWhatIsThePostcodeYouHaveWorkedForGuidanceText() {
  I.see('We need this to help progress your claim. If you work or worked at');
  I.see('home occasionally or full time, enter the postcode where you would');
  I.see('go to work for the employer.');
  I.see('If you’re claiming against someone you’ve not worked for - as best');
  I.see('as you can, enter the postcode of where they’re based.');
}
module.exports = {
  verifyMakeAClaimToAnEmploymentTribunal,
  verifyBeforeYouContinueGuidanceText,
  verifyWhatIsThePostcodeYouHaveWorkedForGuidanceText,
};
