import { BasePage } from './basePage';

export class MakeClaimPage extends BasePage {
  async stepsToMakingYourClaim(clickCheckYourAnswers?: boolean): Promise<void> {
    await this.webAction.verifyTextIsVisible('Steps to making your claim');
    await this.webAction.verifyTextIsVisible('Application Details');
    // your details
    await this.webAction.verifyTextIsVisible('Your details');
    await this.webAction.verifyTextIsVisible('Personal details');
    await this.webAction.verifyTextIsVisible('Contact details');
    await this.webAction.verifyTextIsVisible('Your preferences');

    //Employment details
    await this.webAction.verifyTextIsVisible('Employment and respondent details');
    await this.webAction.verifyTextIsVisible('Employment status');
    await this.webAction.verifyTextIsVisible('Respondent details');

    //Claim details
    await this.webAction.verifyTextIsVisible('Claim details');
    await this.webAction.verifyTextIsVisible('Describe what happened to you');
    await this.webAction.verifyTextIsVisible('Tell us what you want from your claim');
    await this.webAction.verifyTextIsVisible('Check and submit');
    await this.webAction.verifyTextIsVisible('Check your answers');

    if (clickCheckYourAnswers) {
      await this.webAction.clickElementByCss("//a[contains(.,'Check your answers')]");
    }
  }
}
