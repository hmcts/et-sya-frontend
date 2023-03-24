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
  I.see('If you do not have a certificate or a reason you need to contact Acas (opens in new tab).');
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
  I.see('Telephone: 0300 303 5176(Welsh language)');
  I.see('Telephone: 0300 790 6234(Scotland)');
  I.see('Textphone: 18001 0300 123 1024(England and Wales)');
  I.see('Textphone: 18001 0300 790 6234(Scotland)');
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
  I.see('This will decide which Employment Tribunal office deals with your claim.');
  I.see('If you worked at home, enter your home postcode.');
  I.see('If you’re claiming against someone you did not work for,');
  I.see('enter the postcode of where they are based.');
}

async function verifyARepresentativeGuidanceText() {
  I.see('A representative is someone who can act on your behalf to complete the claim, write to the');
  I.see('employment tribunal or present your case at a hearing.');
}

async function verifyWhoCanActAsARepresentativeGuidanceText() {
  I.see('Free representation can include:');
  I.see('friends');
  I.see('colleagues');
  I.see('family members');
  I.see('trade unions (if one is available to you)');
  I.see('Citizens Advice advisers');
  I.see('advisers from law clinics or law centres');
  I.see('Paid representation be through legal professionals, including:');
  I.see('solicitors');
  I.see("barristers (called 'advocates' in Scotland)");
  I.see('legal executives');
  I.see('claims management companies (regulated by the Financial Conduct Authority (FCA))');
}

async function verifyHowToFindARepresentativeGuidanceText() {
  I.see('The following links open in a new tab');
  I.seeElement("//a[.='Find a solicitor in England and Wales(opens in new tab)']");
  I.see('– list of solicitors run by The Law Society');
  I.seeElement("//a[.='Find a solicitor in Scotland(opens in new tab)']");
  I.see('– charity providing legal advice, case preparation and advocacy');
  I.seeElement("//a[.='Free Representation Unit (FRU)(opens in new tab)']");
  I.see(
    '– charity providing legal advice, case preparation and advocacy for people not eligible for legal aid or who cannot afford lawyers (this service is not available in Scotland)'
  );
  I.see('In Scotland, some university law clinics can provide advice and represenation. You can find a list at');
  I.seeElement("//a[.='The Scottish University Law Clinic Network (SULCN)(opens in new tab)']");
  I.see(
    'local ‘law centres’ – not-for-profit legal practices providing legal aid for people who cannot afford lawyers.'
  );
  I.see('A trade union may also be able to pay for a solicitor and free legal advice is available from');
  I.seeElement("//a[.='Citizens Advice(opens in new tab)']");
  I.see('or');
  I.seeElement("//a[.='Citizens Advice Scotland(opens in new tab)']");
  I.seeElement("//a[.='Equality Advisory and Support Service(opens in new tab)']");
  I.see('can help with discrimination claims.');
  I.see('Some people may also be able to get help to pay for legal advice through legal aid.');
}

async function verifyAreYouMakingAClaimOnYourOwnGuidanceText() {
  I.see('You can make a claim to an employment tribunal on your own, where you are the only claimant. You can');
  I.see('also make a claim alongside another person, or a group of people who have been treated in the same');
  I.see('way.');
  I.see('It helps the employment tribunal to know which type it is. If you do not know, choose the first option.');
  I.see('If you’re claiming with other people, you will be asked to tell us their names (if you know them).');
}

async function verifyACASConciliationGuidanceText() {
  I.see('To make a claim you usually need to get an Acas early conciliation certificate (or give a valid reason why');
  I.see('you do not have one) for each respondent you’re making your claim against.');

  I.see('Acas will have sent you certificates after you initially contacted them to try and settle your dispute');
  I.see('through early conciliation.');

  I.see('The certificates include the details of the respondents you’re making your claim against along with a');
  I.see('number to identify them. You’ll need to provide these later as part of your claim.');
}

module.exports = {
  verifyMakeAClaimToAnEmploymentTribunal,
  verifyBeforeYouContinueGuidanceText,
  verifyWhatIsThePostcodeYouHaveWorkedForGuidanceText,
  verifyARepresentativeGuidanceText,
  verifyWhoCanActAsARepresentativeGuidanceText,
  verifyHowToFindARepresentativeGuidanceText,
  verifyAreYouMakingAClaimOnYourOwnGuidanceText,
  verifyACASConciliationGuidanceText,
};
