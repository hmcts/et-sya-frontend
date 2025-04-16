import { params } from '../utils/config';

import { BasePage } from './basePage';

export class ClaimStartPage extends BasePage {
  // constructor(page: Page) {}

  async initialPageFlow(): Promise<void> {
    // Make a Claim to an employment Tribunal Page....
    await this.page.goto(params.TestUrlCitizenUi);
    await this.webAction.verifyElementContainsText(
      this.page.locator('h1.govuk-heading-xl'),
      'Make a claim to an employment tribunal'
    );
    await this.verifyMakeAClaimToAnEmploymentTribunal();
    await this.webAction.clickElementByText('Start now');

    await this.webAction.verifyElementContainsText(this.page.locator('h1.govuk-heading-l'), 'Before you continue');
    await this.verifyBeforeYouContinueGuidanceText();
    await this.webAction.clickElementByText('Contact us');
    await this.verifyContactUs();
    await this.clickContinue();
  }

  async verifyMakeAClaimToAnEmploymentTribunal(): Promise<void> {
    await this.webAction.verifyTextPresentOnPage(
      'text=Use this service to make claims to an employment tribunal when an employer, potential employer, trade union or'
    );
    await this.webAction.verifyTextPresentOnPage('text=person at work has treated another person unlawfully.');
    await this.webAction.verifyTextPresentOnPage(
      "text=During the employment tribunal process the organisations or people you're making a claim against are known as"
    );
    await this.webAction.verifyTextPresentOnPage('text=‘respondents’.');
    await this.webAction.verifyTextPresentOnPage(
      'text=To make a claim you need to contact Acas and get an ‘Early conciliation certificate’ from them or give us a'
    );
    await this.webAction.verifyTextPresentOnPage('text=valid reason why you do not have one.');
    await this.webAction.verifyTextPresentOnPage(
      'text=If you do not have a certificate or a reason you need to contact Acas (opens in new tab).'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=You do not have to make your claim in one go. You can save and return to it at any time before you submit it.'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=Claims usually have to be made within 3 months of employment ending or problems happening. If a claim is'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=late, you must explain why. A judge will then decide what happens next.'
    );
    await this.webAction.verifyTextPresentOnPage('text=Have you already started a claim?');
    await this.webAction.verifyTextPresentOnPage('text=Return to an existing claim');
    await this.webAction.verifyTextPresentOnPage('text=Help using the service');
    await this.webAction.verifyTextPresentOnPage(
      'text=Call one of our Employment Tribunal customer contact centres. They cannot give you legal advice.'
    );
    await this.webAction.verifyTextPresentOnPage('text=Telephone: 0300 323 0196');
    await this.webAction.verifyTextPresentOnPage('text=Telephone: 0300 303 5176 (Welsh language)');
    await this.webAction.verifyTextPresentOnPage('text=Telephone: 0300 790 6234 (Scotland)');
    await this.webAction.verifyTextPresentOnPage('text=Monday to Friday, 9am to 5pm');
    await this.webAction.verifyTextPresentOnPage('text=Find out about call charges (opens in new tab)');
  }

  async verifyBeforeYouContinueGuidanceText(): Promise<void> {
    await this.webAction.verifyTextPresentOnPage(
      'text=You’ll have the opportunity to provide detailed information about your claim, but you might want to have'
    );
    await this.webAction.verifyTextPresentOnPage('text=the minimum required information to hand:');
    await this.webAction.verifyTextPresentOnPage(
      'text=The name and address of each claimant (you or the person you’re claiming for)'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=Name and address of each respondent you’re making the claim against - this can be found in any'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=letter you received offering you the job, a contract of employment or payslips'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=Certificate number from the Acas early conciliation process for each respondent, or explain why you'
    );
    await this.webAction.verifyTextPresentOnPage('text=do not have one');
    await this.webAction.verifyTextPresentOnPage(
      'text=You do not have to complete your claim in one session. You can save your progress and return to the claim'
    );
    await this.webAction.verifyTextPresentOnPage('text=at any time before submitting.');
  }

  async verifyContactUs(): Promise<void> {
    await this.webAction.verifyTextPresentOnPage('text=Telephone:');
    await this.webAction.verifyTextPresentOnPage('text=0300 323 0196');
    await this.webAction.verifyTextPresentOnPage('text=Telephone:');
    await this.webAction.verifyTextPresentOnPage('text=0300 303 5176 (Welsh language)');
    await this.webAction.verifyTextPresentOnPage('text=Telephone:');
    await this.webAction.verifyTextPresentOnPage('text=0300 790 6234 (Scotland)');
    await this.webAction.verifyTextPresentOnPage('text=Monday to Friday, 9am to 5pm');
    await this.webAction.verifyTextPresentOnPage('text=Find out about call charges (opens in new tab)');
  }

  async verifyARepresentativeGuidanceText(): Promise<void> {
    await this.webAction.verifyTextPresentOnPage(
      'text=A representative is someone who can act on your behalf to complete the claim, write to the employment tribunal or present your case at a hearing.'
    );
  }

  async verifyWhoCanActAsARepresentativeGuidanceText(): Promise<void> {
    await this.webAction.verifyTextPresentOnPage('text=Free representation can include:');
    await this.webAction.verifyTextPresentOnPage('text=friends');
    await this.webAction.verifyTextPresentOnPage('text=colleagues');
    await this.webAction.verifyTextPresentOnPage('text=family members');
    await this.webAction.verifyTextPresentOnPage('text=trade unions (if one is available to you)');
    await this.webAction.verifyTextPresentOnPage('text=Citizens Advice advisers');
    await this.webAction.verifyTextPresentOnPage('text=advisers from law clinics or law centres');
    await this.webAction.verifyTextPresentOnPage('text=Paid representation be through legal professionals, including:');
    await this.webAction.verifyTextPresentOnPage("text=barristers (called 'advocates' in Scotland)");
    await this.webAction.verifyTextPresentOnPage('text=legal executives');
    await this.webAction.verifyTextPresentOnPage(
      'text=claims management companies (regulated by the Financial Conduct Authority (FCA))'
    );
  }

  async verifyAreYouMakingAClaimOnYourOwnGuidanceText(): Promise<void> {
    await this.webAction.verifyTextPresentOnPage(
      'text=You can make a claim to an employment tribunal on your own, where you are the only claimant. You can'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=also make a claim alongside another person, or a group of people who have been treated in the same'
    );
    await this.webAction.verifyTextPresentOnPage('text=way.');
    await this.webAction.verifyTextPresentOnPage(
      'text=It helps the employment tribunal to know which type it is. If you do not know, choose the first option.'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=If you’re claiming with other people, you will be asked to tell us their names (if you know them).'
    );
  }

  async verifyWhereYouCanMakeYourClaimGuidanceText(): Promise<void> {
    await this.webAction.verifyTextPresentOnPage(
      'text=You can make a claim in the Employment Tribunals in England and Wales or the Employment Tribunals in Scotland. They are separate jurisdictions.'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=You can make your claim in England and Wales if any of the following conditions apply:'
    );
    await this.webAction.verifyTextPresentOnPage('text=The issues you’re claiming about happened in England or Wales.');
    await this.webAction.verifyTextPresentOnPage(
      'text=The respondent you’re claiming against lives or does business in England or Wales.'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=The work contract related to the claim was partly carried out in England or Wales.'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=The claim has some connection with Great Britain and that connection is at least partly with England and Wales.'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=You can make your claim in Scotland if any of the following conditions apply:'
    );
    await this.webAction.verifyTextPresentOnPage('text=The issues you’re claiming about happened in Scotland.');
    await this.webAction.verifyTextPresentOnPage(
      'text=The respondent you’re claiming against lives or does business in Scotland.'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=The work contract related to the claim was partly carried out in Scotland.'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=The claim has some connection with Great Britain and that connection is at least partly with Scotland.'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=The tribunal will reject your claim if you choose a jurisdiction where none of the conditions apply.'
    );
    await this.webAction.verifyTextPresentOnPage('text=Which jurisdiction are you making your claim in?');
    await this.webAction.verifyTextPresentOnPage(
      'text=You must consider the jurisdiction at the time when the issues happened.'
    );
  }

  async verifyACASConciliationGuidanceText(): Promise<void> {
    await this.webAction.verifyTextPresentOnPage(
      'text=To make a claim you usually need to get an Acas early conciliation certificate (or give a valid reason why you do not have one) for each respondent you’re making your claim against.'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=Acas will have sent you certificates after you initially contacted them to try and settle your dispute through early conciliation.'
    );
    await this.webAction.verifyTextPresentOnPage(
      'text=The certificates include the details of the respondents you’re making your claim against along with a number to identify them. You’ll need to provide these later as part of your claim.'
    );
  }

  async createSingleMyselfCase(): Promise<void> {
    await this.initialPageFlow();

    await this.webAction.verifyTextPresentOnPage(
      'text=Are you making the claim for yourself, or representing someone else?'
    );
    await this.webAction.verifyTextPresentOnPage('text=Who can act as a representative?');
    await this.webAction.verifyTextPresentOnPage('text=How to find and get a representative?');
    await this.webAction.verifyTextPresentOnPage('text=I’m representing myself and making my own claim');
    await this.webAction.verifyTextPresentOnPage(
      'text=I’m making a claim for someone else and acting as their representative'
    );
    await this.webAction.clickElementByText('Who can act as a representative?');
    await this.verifyWhoCanActAsARepresentativeGuidanceText();
    await this.webAction.clickElementByText('How to find and get a representative?');
    await this.webAction.checkElementById('#lip-or-representative');
    await this.clickContinue();

    //Are you making a claim on your own or with others Page
    await this.delay(2000);
    await this.webAction.verifyTextPresentOnPage('text=Are you making a claim on your own or with others?');
    await this.verifyAreYouMakingAClaimOnYourOwnGuidanceText();
    await this.webAction.verifyTextPresentOnPage('text=I’m claiming on my own');
    await this.webAction.verifyTextPresentOnPage('text=I’m claiming with another person or other people');
    await this.webAction.checkElementById('#single-or-multiple-claim');
    await this.webAction.clickElementByText('Continue');

    //Where you can make your claim Page....
    await this.delay(2000);
    await this.webAction.verifyTextPresentOnPage('text=Where you can make your claim');
    await this.verifyWhereYouCanMakeYourClaimGuidanceText();
    await this.webAction.verifyTextIsVisible('text=England and Wales');
    await this.webAction.verifyTextIsVisible('text=Scotland');
    await this.webAction.clickElementByText('Contact us');
    await this.verifyContactUs();
    await this.webAction.checkElementById('#claim-jurisdiction');
    await this.clickContinue();

    //Do you have an ACAS Early Conciliation certificate
    await this.delay(2000);
    await this.webAction.verifyTextPresentOnPage(
      'text=Do you have an ‘Acas early conciliation certificate’ for the respondent or respondents you’re claiming against?'
    );
    await this.webAction.checkElementById('#acas-multiple');
    await this.webAction.clickElementByText('Continue');

    //Type of claim = discrimination
    await this.delay(2000);
    await this.webAction.verifyTextPresentOnPage('text=What type of claim are you making?');
    await this.webAction.verifyTextPresentOnPage(
      'text=You can choose all that apply to you. Further information will be asked for later in the claim.'
    );
    await this.webAction.verifyTextPresentOnPage('text=Select all that apply');
    await this.webAction.verifyTextPresentOnPage('text=Discrimination of any type');
    await this.webAction.verifyTextPresentOnPage(
      'text=for example because of your sex, ethnicity, disability or other characteristic'
    );
    await this.webAction.verifyTextPresentOnPage('text=Pay-related claim');
    await this.webAction.verifyTextPresentOnPage('text=Unfair dismissal');
    await this.webAction.verifyTextPresentOnPage('text=including constructive dismissal');
    await this.webAction.verifyTextIsVisible('text=Whistleblowing');
    await this.webAction.verifyTextPresentOnPage(
      'text=including dismissal or any other unfair treatment after whistleblowing'
    );
    await this.webAction.verifyTextPresentOnPage('text=Other type of claim');
    await this.webAction.checkElementById('#discrimination');
    await this.webAction.checkElementById('#whistleBlowing');
    await this.clickContinue();
  }
}
