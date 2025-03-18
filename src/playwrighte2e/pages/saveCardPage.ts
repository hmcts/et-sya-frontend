import { BasePage } from "./basePage";

export class SaveCardPage extends BasePage {

    async doNotHaveToCompleteCard() {
        
        await this.webAction.verifyTextIsVisible('text=Contact us');
        await this.webAction.verifyTextIsVisible('text=You do not have to complete your claim in one go');
        await this.clickContinue();
    }

}