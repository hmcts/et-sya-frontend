import { BasePage } from "./basePage";

export class PersonDetailsPage extends BasePage {

    async enterPersonalDetails() {

        await this.webAction.clickElementByCss('[href="/dob-details?lng=en"]');
        await this.webAction.fillField('#dobDate-day', '01');
        await this.webAction.fillField('#dobDate-month', '01');
        await this.webAction.fillField('#dobDate-year', '2000');
        await this.clickContinue();

        await this.webAction.verifyTextIsVisible('text=Sex and preferred title');
        await this.webAction.checkElementById('#sex-3');
        await this.clickContinue();

        await this.webAction.verifyTextIsVisible('text=Enter a UK postcode');
        await this.webAction.fillField('#addressEnterPostcode', 'LS9 9HC');
        await this.clickContinue();

        await this.webAction.verifyTextIsVisible('text=Select an address');
        await this.webAction.verifyTextIsVisible('text=No addresses found');
        await this.clickContinue();

        await this.webAction.fillField('#address1', '3 Skelton Avenue');
        await this.webAction.fillField('#address2', '');
        await this.webAction.fillField('#addressTown', 'Leeds');
        await this.webAction.fillField('#addressCountry', 'England');
        await this.webAction.fillField('#addressPostcode', 'LS9 9HE');
        await this.clickContinue();

        await this.webAction.verifyTextIsVisible('text=What is your telephone number?');
        await this.clickContinue();

        await this.webAction.verifyTextIsVisible('text=Communication preference');
        await this.webAction.verifyTextIsVisible('text=What format would you like to be contacted in?');
        await this.webAction.verifyTextIsVisible('text=Email');
        await this.webAction.verifyTextIsVisible('text=Post');
        await this.webAction.verifyTextIsVisible('text=What language do you want us to use when we contact you?');
        await this.webAction.verifyTextIsVisible('text=English');
        await this.webAction.verifyTextIsVisible('text=Welsh');
        await this.webAction.verifyTextIsVisible('text=If a hearing is required, what language do you want to speak at a hearing?');
        await this.webAction.verifyTextIsVisible('text=English');
        await this.webAction.verifyTextIsVisible('text=Welsh');
        await this.webAction.checkElementById('#update-preference-2');
        await this.webAction.checkElementById('#update-preference-language-2');
        await this.webAction.checkElementById('#update-hearing-language-2');
        await this.clickContinue();


        await this.webAction.checkElementById('#hearingPreferences');
        await this.clickContinue();

        await this.webAction.verifyTextIsVisible('text=Do you have a physical, mental or learning disability or long term health condition that means you need support during your case?');
        await this.webAction.checkElementById('#reasonableAdjustments-2');
        await this.clickContinue();

        await this.webAction.verifyTextIsVisible('text=Have you completed this section?');
        await this.webAction.checkElementById('#tasklist-check');
        await this.clickContinue();
        await this.delay(5000);

        
            //         I.click('[href="/dob-details?lng=en"]');

            // await I.scrollPageToBottom();
            // await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
            // I.see('Date of birth (optional)');
            // I.see('What is your date of birth?');
            // I.fillField('#dobDate-day', '01');
            // I.fillField('#dobDate-month', '01');
            // I.fillField('#dobDate-year', '2000');
            // I.click(commonConfig.saveAndContinue);

            // await I.scrollPageToBottom();
            // await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
            // I.see('Sex and preferred title');
            // I.checkOption('#sex-3');
            // I.click(commonConfig.saveAndContinue);

            // await I.scrollPageToBottom();
            // await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
            // I.see('Enter a UK postcode');
            // I.refreshPage();
            // I.fillField('#addressEnterPostcode', 'LS9 9HC');
            // I.click(commonConfig.saveAndContinue);
            // I.waitForVisible('#addressAddressTypes', testConfig.TestWaitForTextTimeLimit);
            // I.see('Select an address');
            // I.see('No addresses found');
            // I.click(commonConfig.saveAndContinue);
            // I.fillField('#address1', '3 Skelton Avenue');
            // I.fillField('#address2', '');
            // I.fillField('#addressTown', 'Leeds');
            // I.fillField('#addressCountry', 'England');
            // I.fillField('#addressPostcode', 'LS9 9HE');
            // I.click(commonConfig.saveAndContinue);
            // I.see('What is your telephone number?');

            // await I.scrollPageToBottom();
            // await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
            // I.click(commonConfig.saveAndContinue);
            // I.see('Communication preference');
            // I.see('What format would you like to be contacted in?');
            // I.see('Email');
            // I.see('Post');
            // I.see('What language do you want us to use when we contact you?');
            // I.see('English');
            // I.see('Welsh');
            // I.see('If a hearing is required, what language do you want to speak at a hearing?');
            // I.see('English');
            // I.see('Welsh');
            // I.checkOption('#update-preference-2');
            // I.checkOption('#update-preference-language-2');
            // I.checkOption('#update-hearing-language-2');
            // I.wait(2);
            // I.click(commonConfig.saveAndContinue);

            // await I.scrollPageToBottom();
            // await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
            // I.waitForElement('#hearingPreferences', testConfig.TestWaitForVisibilityTimeLimit);
            // I.checkOption('#hearingPreferences');
            // I.click(commonConfig.saveAndContinue);

            // await I.scrollPageToBottom();
            // await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
            // I.see(
            //     'Do you have a physical, mental or learning disability or long term health condition that means you need support during your case?'
            // );
            // I.checkOption('#reasonableAdjustments-2');
            // I.click(commonConfig.saveAndContinue);

            // await I.scrollPageToBottom();
            // await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
            // I.see('Have you completed this section?');
            // I.checkOption('#tasklist-check');
            // I.click(commonConfig.saveAndContinue);
            // I.wait(5);
    }
    
}