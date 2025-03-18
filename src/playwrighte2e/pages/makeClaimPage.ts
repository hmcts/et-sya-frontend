import { BasePage } from "./basePage";

export class MakeClaimPage extends BasePage {

    async stepsToMakingYourClaim(clickCheckYourAnswers?: boolean) {


        await this.webAction.verifyTextIsVisible('Steps to making your claim');
        await this.webAction.verifyTextIsVisible('Application Details');
        await this.webAction.verifyTextIsVisible('Claim type');
        /*I.see('Discrimination');
        I.see('Whistleblowing');*/  

       
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

        // //Employment details
        // I.see('Employment and respondent details');
        // I.see('Employment status');
        // I.see('Respondent details');

        // //Claim details
        // I.see('Claim details');
        // I.see('Describe what happened to you');
        // I.see('Tell us what you want from your claim');

        // I.see('Check and submit');
        // I.see('Check your answers');
        // I.see('Contact us');

        // I.click("//span[@class='govuk-details__summary-text']"); //As there are 2 Contact us Links on the Page...
        // I.wait(1);
        // await contactUs.verifyContactUs();

        // if (clickCheckYourAnswers) {
        //     await I.waitForVisible("//a[contains(.,'Check your answers')]", testConfig.TestWaitForVisibilityTimeLimit);
        //     I.click("//a[contains(.,'Check your answers')]");
        // }
    }
}