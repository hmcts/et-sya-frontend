import { Locator, Page } from '@playwright/test';

import { params } from '../utils/config';

import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  private readonly username: Locator;
  private readonly password: Locator;
  private readonly signInOrContinueButton: Locator;

  constructor(page: Page) {
    super(page);
    // Flexible locators covering both new and old IDAM UI
    this.username = page.locator(
      '[data-testid="idam-username-input"], #username, input[name="username"], #email, input[type="email"]'
    );
    this.password = page.locator(
      '[data-testid="idam-password-input"], #password, input[name="password"], input[type="password"]'
    );
    this.signInOrContinueButton = page
      .locator('[data-testid="idam-submit-button"], [name="save"], button[type="submit"], input[type="submit"]')
      .filter({ hasText: /Sign in|Continue/i });
  }

  private async headingText(): Promise<string> {
    await this.page.waitForLoadState('load');
    return (await this.page.locator('h1').first().innerText()).trim();
  }

  async signIn(): Promise<void> {
    await this.page.waitForLoadState('load');
    const heading = await this.headingText();

    if (heading === 'Sign in or create an account') {
      if ((await this.username.count()) > 0) {
        // Old IDAM: email + password fields on the same page
        await this.username.fill(params.TestEnvETClaimantEmailAddress);
        await this.password.fill(params.TestEnvETClaimantPassword);
        await this.signInOrContinueButton.click();
      } else {
        // New IDAM: intermediate page — click "Sign in" to reach the email step
        await this.page.getByRole('button', { name: 'Sign in' }).click();
        await this.page.waitForLoadState('load');
        await this.username.fill(params.TestEnvETClaimantEmailAddress);
        await this.signInOrContinueButton.click();
        await this.page.waitForLoadState('load');
        await this.password.fill(params.TestEnvETClaimantPassword);
        await this.signInOrContinueButton.click();
      }
    } else if (heading === 'Sign in') {
      // Old IDAM: single-page form with email and password together
      await this.username.fill(params.TestEnvETClaimantEmailAddress);
      await this.password.fill(params.TestEnvETClaimantPassword);
      await this.signInOrContinueButton.click();
    } else if (heading === 'Enter your email address') {
      // New IDAM: already past the intermediate page — email then password
      await this.username.fill(params.TestEnvETClaimantEmailAddress);
      await this.signInOrContinueButton.click();
      await this.page.waitForLoadState('load');
      await this.password.fill(params.TestEnvETClaimantPassword);
      await this.signInOrContinueButton.click();
    } else {
      throw new Error(`Unexpected login page heading: '${heading}'`);
    }
  }
}
