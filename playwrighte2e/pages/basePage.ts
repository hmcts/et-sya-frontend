import { Locator, Page } from '@playwright/test';

import { WebAction } from '../common/web.actions';

export abstract class BasePage {
  readonly page: Page;
  readonly continueButton: Locator;
  readonly signInButton: Locator;
  readonly saveAsDraftButton: Locator;
  readonly closeAndReturnButton: Locator;
  readonly submit: Locator;
  readonly postcode: Locator;
  readonly findAddress: Locator;
  readonly signout: Locator;
  readonly startNow: Locator;
  readonly saveAndContinue: Locator;
  readonly nextButton: Locator;
  readonly applyFilterButton: Locator;
  readonly addNewBtn: Locator;
  readonly newhearingBtn: Locator;
  readonly newUploadDocBtn: Locator;
  readonly skipQuestionBtn: Locator;
  readonly webAction: WebAction;

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.locator('button:has-text("Continue"), a:has-text("Continue")');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.saveAsDraftButton = page.getByRole('button', { name: 'Save as draft' });
    this.closeAndReturnButton = this.page.getByRole('button', { name: 'Close and Return to case' });
    this.submit = this.page.getByRole('button', { name: 'Submit' });
    this.applyFilterButton = this.page.getByRole('button', { name: 'Apply filter' });
    this.postcode = page.getByRole('textbox', { name: 'Enter a UK postcode' });
    this.findAddress = page.getByRole('button', { name: 'Find address' });
    this.signout = page.getByText('Sign out');
    this.startNow = page.getByRole('button', { name: 'Start now' });
    this.saveAndContinue = page.getByRole('button', { name: 'Save and continue' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.addNewBtn = page.getByRole('button', { name: 'Add new' });
    this.newhearingBtn = page.locator(
      '#hearingCollection > div > button.button.write-collection-add-item__bottom.ng-star-inserted'
    );
    this.newUploadDocBtn = page.locator('//*[@id="documentCollection"]/div/button[2]');
    this.skipQuestionBtn = page.locator('[name="opt-out-button"]');
    this.webAction = new WebAction(this.page);
  }

  async wait(time: number): Promise<void> {
    await this.page.waitForTimeout(time);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async clickSaveAndContinue(): Promise<void> {
    await this.saveAndContinue.click();
  }

  async saveAsDraft(): Promise<void> {
    await this.saveAsDraftButton.click();
  }

  async closeAndReturn(): Promise<void> {
    await this.closeAndReturnButton.click();
  }

  async skipQuestion(): Promise<void> {
    await this.skipQuestionBtn.click();
  }

  async submitButton(): Promise<void> {
    await this.submit.click();
  }

  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async clickNextButton(): Promise<void> {
    await this.nextButton.click();
  }

  async clickElement(elementLocator: string): Promise<void> {
    await this.page.click(elementLocator);
  }

  // async enterPostCode(postcode){
  //   await this.postcode.fill(postcode);
  //   await this.wait(3000);
  //   await this.findAddress.click();
  //   await this.wait(3000);
  //   await this.page.getByLabel('Select an address').selectOption('1: Object');
  // }

  async signoutButton(): Promise<void> {
    await this.signout.click();
  }

  async clickStartNow(): Promise<void> {
    await this.startNow.click();
  }

  async saveAndContinueButton(): Promise<void> {
    await this.saveAndContinue.click();
  }

  async addNewButtonClick(): Promise<void> {
    await this.addNewBtn.click();
  }

  async addNewHearingButtonClick(): Promise<void> {
    await this.newhearingBtn.click();
  }

  async addNewUploadDocButtonClick(): Promise<void> {
    await this.newUploadDocBtn.click();
  }
}
