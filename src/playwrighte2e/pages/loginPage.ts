import { BasePage } from "./basePage";
import { params } from '../utils/config';

export class LoginPage  extends BasePage {

    async signIn() {
        await this.webAction.verifyTextIsVisible('Sign in');
        await this.webAction.fillField('#username', params.TestEnvETClaimantEmailAddress);
        await this.webAction.fillField('#password', params.TestEnvETClaimantPassword);
        await this.clickSignIn();
    }
}