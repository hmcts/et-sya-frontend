import { BasePage } from './basePage';

export class GroupClaimsDetailsPage extends BasePage {
  async enterGroupClaimsDetails(): Promise<void> {
    await this.webAction.clickElementByCss('[href="/single-or-multiple-claim?lng=en"]');
    await this.webAction.verifyTextIsVisible('text=Claiming on your own or with others');
    await this.webAction.verifyTextIsVisible('text=Are you making a claim on your own or with others?');
    await this.webAction.verifyTextIsVisible('text=I’m claiming on my own');
    await this.webAction.verifyTextIsVisible('text=I’m claiming with another person or other people');
    await this.webAction.checkElementByLabel('I’m claiming on my own');
    await this.saveAndContinueButton();

    await this.webAction.verifyTextIsVisible('text=Have you completed this section?');
    await this.webAction.checkElementByLabel("Yes, I've completed this section");
    await this.saveAndContinueButton();
    await this.delay(5000);
  }
}
