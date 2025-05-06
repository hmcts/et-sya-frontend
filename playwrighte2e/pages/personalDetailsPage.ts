import { BasePage } from './basePage';

export class PersonDetailsPage extends BasePage {
  async enterPersonalDetails(): Promise<void> {
    await this.webAction.clickElementByCss('[href="/dob-details?lng=en"]');
    await this.webAction.fillField('#dobDate-day', '01');
    await this.webAction.fillField('#dobDate-month', '01');
    await this.webAction.fillField('#dobDate-year', '2000');
    await this.saveAndContinueButton();

    await this.webAction.verifyTextIsVisible('text=Sex and preferred title');
    await this.webAction.checkElementById('#sex-3');
    await this.saveAndContinueButton();

    await this.webAction.verifyTextIsVisible('text=Enter a UK postcode');
    await this.webAction.fillField('#addressEnterPostcode', 'LS9 9HC');
    await this.saveAndContinueButton();

    await this.webAction.verifyTextIsVisible('text=Select an address');
    await this.webAction.verifyTextIsVisible('text=No addresses found');
    await this.saveAndContinueButton();

    await this.webAction.fillField('#address1', '3 Skelton Avenue');
    await this.webAction.fillField('#address2', '');
    await this.webAction.fillField('#addressTown', 'Leeds');
    await this.webAction.fillField('#addressCountry', 'England');
    await this.webAction.fillField('#addressPostcode', 'LS9 9HE');
    await this.saveAndContinueButton();

    await this.webAction.verifyTextIsVisible('text=What is your telephone number?');
    await this.saveAndContinueButton();

    await this.webAction.verifyTextIsVisible('text=Communication preference');
    await this.webAction.verifyTextIsVisible('text=What format would you like to be contacted in?');
    await this.webAction.verifyTextIsVisible('text=Email');
    await this.webAction.verifyTextIsVisible('text=Post');
    await this.webAction.verifyTextIsVisible('text=What language do you want us to use when we contact you?');
    await this.webAction.verifyTextIsVisible('text=English');
    await this.webAction.verifyTextIsVisible('text=Welsh');
    await this.webAction.verifyTextIsVisible(
      'text=If a hearing is required, what language do you want to speak at a hearing?'
    );
    await this.webAction.verifyTextIsVisible('text=English');
    await this.webAction.verifyTextIsVisible('text=Welsh');
    await this.webAction.checkElementById('#update-preference-2');
    await this.webAction.checkElementById('#update-preference-language-2');
    await this.webAction.checkElementById('#update-hearing-language-2');
    await this.saveAndContinueButton();

    await this.webAction.verifyTextIsVisible('text=Would you be able to take part in hearings by video and phone?');
    await this.webAction.checkElementById('#hearingPreferences');
    await this.saveAndContinueButton();

    await this.webAction.verifyTextIsVisible(
      'text=Do you have a physical, mental or learning disability or long term health condition that means you need support during your case?'
    );
    await this.webAction.checkElementById('#reasonableAdjustments-2');
    await this.saveAndContinueButton();

    await this.webAction.verifyTextIsVisible('text=Have you completed this section?');
    await this.webAction.checkElementById('#tasklist-check');
    await this.saveAndContinueButton();
    await this.delay(5000);
  }
}
