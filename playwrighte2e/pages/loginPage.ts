import { params } from '../utils/config';

import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  async signIn(): Promise<void> {
    await this.webAction.verifyTextIsVisible('Sign in');
    await this.webAction.fillField('#username', params.TestEnvETClaimantEmailAddress);
    await this.webAction.fillField('#password', params.TestEnvETClaimantPassword);
    await this.clickSignIn();
  }
}
