import { BasePage } from './basePage';

export class SubmitPage extends BasePage {
  async submitClaim(allEqualityPages: boolean): Promise<void> {
    await this.webAction.verifyTextIsVisible('text=Equality and diversity questions');

    if (allEqualityPages) {
      await this.webAction.clickElementByText('text=Continue to the questions');

      //Main Language Page
      await this.webAction.verifyTextIsVisible('text=What is your main language?');
      await this.webAction.verifyTextIsVisible('text=English');
      await this.webAction.verifyTextIsVisible('text=Welsh');
      await this.webAction.verifyTextIsVisible('text=Other');
      await this.webAction.verifyTextIsVisible('text=Prefer not to say');
      await this.webAction.verifyTextIsVisible('text=Why we are asking this question');
      await this.webAction.clickElementByText('text=Why we are asking this question');
      await this.webAction.verifyElementContainsText(
        this.page.locator(
          'text=This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
        ),
        'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
      );
      await this.webAction.checkElementById('//input[@value="0"]');
      await this.clickContinue();

      //Best Describe Yourself Page
      await this.webAction.verifyTextIsVisible('text=Which of the following best describes how you think of yourself?');
      await this.webAction.clickElementByText('text=Why we are asking this question');
      await this.webAction.verifyElementContainsText(
        this.page.locator(
          'text=This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
        ),
        'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
      );
      await this.webAction.checkElementById('//input[@value="0"]');
      await this.clickContinue();

      //Are you married or in a Civil Partnership
      await this.webAction.verifyTextIsVisible('text=Are you married or in a legally registered civil partnership?');
      await this.webAction.clickElementByText('text=Why we are asking this question');
      await this.webAction.verifyElementContainsText(
        this.page.locator(
          'text=This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
        ),
        'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
      );
      await this.webAction.checkElementById('//input[@value="0"]');
      await this.clickContinue();

      //Ethnic Group Page
      await this.webAction.verifyTextIsVisible('text=What is your ethnic group?');
      await this.webAction.clickElementByText('text=Why we are asking this question');
      await this.webAction.verifyElementContainsText(
        this.page.locator(
          'text=This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
        ),
        'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
      );
      await this.webAction.checkElementById('//input[@value="0"]');
      await this.clickContinue();

      //Religion Page
      await this.webAction.verifyTextIsVisible('text=What is your religion?');
      await this.webAction.clickElementByText('text=Why we are asking this question');
      await this.webAction.verifyElementContainsText(
        this.page.locator(
          'text=This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
        ),
        'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
      );
      await this.webAction.checkElementById('//input[@value="0"]');
      await this.clickContinue();

      //Physical or Mental Conditions Page
      await this.webAction.verifyTextIsVisible(
        'text=Do you have any physical or mental health conditions or illnesses lasting or expected to last 12 months or more?'
      );
      await this.webAction.clickElementByText('text=Why we are asking this question');
      await this.webAction.verifyElementContainsText(
        this.page.locator(
          'text=This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
        ),
        'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
      );
      await this.webAction.checkElementById('//input[@value="0"]');
      await this.clickContinue();

      //Pregnant Page
      await this.webAction.verifyTextIsVisible('text=Are you pregnant or have you been pregnant in the last year?');
      await this.webAction.clickElementByText('text=Why we are asking this question');
      await this.webAction.verifyElementContainsText(
        this.page.locator(
          'text=This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
        ),
        'This information helps us check that we’re treating people equally and fairly. It helps us to meet our commitment to equality (under the Equality Act 2010).'
      );
      await this.webAction.checkElementById('//input[@value="0"]');
      await this.clickContinue();

      //You have answered the equality questions
      await this.webAction.verifyTextIsVisible('text=You have answered the equality questions');
      await this.webAction.verifyTextIsVisible('text=The next steps are to check your claim details.');
      await this.clickContinue();
    } else {
      await this.skipQuestion();
    }
  }

  async checkYourAnswers(): Promise<void> {
    await this.webAction.verifyTextIsVisible('text=Check your answers');
    await this.webAction.verifyTextIsVisible('text=Application details');
    await this.webAction.verifyTextIsVisible('text=Claim type');
    await this.webAction.verifyTextIsVisible('text=Discrimination');
    await this.webAction.verifyTextIsVisible('text=Whistleblowing');

    //Your Details
    await this.webAction.verifyTextIsVisible('text=Your details');
    await this.webAction.verifyTextIsVisible('text=Date of birth');
    await this.webAction.verifyTextIsVisible('text=01-01-2000');
    await this.webAction.verifyTextIsVisible('text=Sex');
    await this.webAction.verifyTextIsVisible('text=Preferred title');
    await this.webAction.verifyTextIsVisible('text=Contact or home address');
    await this.webAction.verifyTextIsVisible('text=Telephone number');
    await this.webAction.verifyTextIsVisible('text=How would you like to be contacted?');
    await this.webAction.verifyTextIsVisible('text=Post');
    await this.webAction.verifyTextIsVisible('text=What language do you want us to use when we contact you?');
    await this.webAction.verifyTextIsVisible('text=English');
    await this.webAction.verifyTextIsVisible(
      'text=If a hearing is required, what language do you want to speak at a hearing?'
    );
    await this.webAction.verifyTextIsVisible('text=English');

    await this.webAction.waitForElementToBeVisible('#main-form-submit');
    await this.webAction.clickElementByCss('#main-form-submit');
  }

  async claimSubmitted(): Promise<void> {
    await this.webAction.verifyTextIsVisible('text=Your claim has been submitted');
    await this.webAction.verifyTextIsVisible('text=What happens next');
    await this.webAction.verifyTextIsVisible('text=Submission details');
    await this.webAction.verifyTextIsVisible('text=Submission reference');
    await this.webAction.verifyTextIsVisible('text=Claim submitted');
    const date = new Date();
    const formattedDate = date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    await this.webAction.verifyTextIsVisible(formattedDate);
    await this.webAction.verifyTextIsVisible('text=Download your claim');
    await this.webAction.verifyTextIsVisible('text=Save a copy of your claim');
  }
}
