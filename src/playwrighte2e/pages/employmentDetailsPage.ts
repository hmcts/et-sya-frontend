import { BasePage } from './basePage';

export class EmploymentDetailsPage extends BasePage {
  async didYouWorkForOrg(orgOption: string): Promise<void> {
    await this.webAction.clickElementByCss('[href="/past-employer?lng=en"]');
    if (orgOption === 'No') {
      await this.webAction.clickElementByCss('#past-employer-2');
      await this.clickSaveAndContinue();
      await this.webAction.verifyTextIsVisible("What is the name of the respondent you're making the claim against?");
    }
    if (orgOption === 'Yes') {
      await this.webAction.clickElementByCss('#past-employer');
      await this.clickSaveAndContinue();
      await this.webAction.verifyTextIsVisible(
        "Are you still working for the organisation or person you're making your claim against?"
      );
    }
  }

  async areYouStillWorkingForOrg(stillWorkingOption: string): Promise<void> {
    if (stillWorkingOption === 'Still working for respondent') {
      await this.webAction.clickElementByCss('#still-working');
      await this.clickSaveAndContinue();
      await this.webAction.verifyTextIsVisible('Employment details');
    }
    if (stillWorkingOption === 'Working Notice Period for respondent') {
      await this.webAction.clickElementByCss('#still-working-2');
      await this.clickSaveAndContinue();
      await this.webAction.verifyTextIsVisible('Employment details');
    }
    if (stillWorkingOption === 'No Longer working for respondent') {
      await this.webAction.clickElementByCss('#still-working-3');
      await this.clickSaveAndContinue();
      await this.webAction.verifyTextIsVisible('Employment details');
    }
  }

  async stillWorkingForRespondentJourney(noticePeriodContract: string, noticePeriod: string): Promise<void> {
    await this.webAction.verifyTextIsVisible('Employment details');
    await this.webAction.fillField('#jobTitle', 'Tester');
    await this.clickSaveAndContinue();

    await this.webAction.waitForElementToBeVisible('#startDate-day');
    await this.webAction.fillField('#startDate-day', '20');
    await this.webAction.fillField('#startDate-month', '04');
    await this.webAction.fillField('#startDate-year', '2014');
    await this.clickSaveAndContinue();

    if (noticePeriodContract === 'Yes written contract with notice period') {
      await this.webAction.checkElementById('#notice-period');
      await this.clickSaveAndContinue();
      if (noticePeriod === 'Weeks') {
        await this.webAction.waitForElementToBeVisible('#notice-type');
        await this.webAction.checkElementById('#notice-type');
        await this.clickSaveAndContinue();

        await this.webAction.waitForElementToBeVisible('#notice-length');
        await this.webAction.fillField('#notice-length', '4');
        await this.clickSaveAndContinue();
      } else if (noticePeriod === 'Months') {
        await this.webAction.waitForElementToBeVisible('#notice-type-2');
        await this.webAction.checkElementById('#notice-type-2');
        await this.clickSaveAndContinue();

        await this.webAction.waitForElementToBeVisible('#notice-length');
        await this.webAction.fillField('#notice-length', '1');
        await this.clickSaveAndContinue();
      }
    } else if (noticePeriodContract === 'No written contract with notice period') {
      await this.webAction.checkElementById('#notice-period-2');
      await this.clickSaveAndContinue();
    }
    await this.webAction.waitForElementToBeVisible('#avg-weekly-hrs');
    await this.webAction.fillField('#avg-weekly-hrs', '20');
    await this.clickSaveAndContinue();

    await this.webAction.waitForElementToBeVisible('#pay-before-tax');
    await this.webAction.fillField('#pay-before-tax', '40000');
    await this.webAction.fillField('#pay-after-tax', '35000');
    await this.webAction.checkElementById('#pay-interval');
    await this.clickSaveAndContinue();

    await this.webAction.waitForElementToBeVisible('#pension');
    await this.webAction.checkElementById('#pension');
    await this.webAction.fillField('#pension-contributions', '200');
    await this.clickSaveAndContinue();

    await this.webAction.waitForElementToBeVisible('#employee-benefits');
    await this.webAction.checkElementById('#employee-benefits');
    await this.clickSaveAndContinue();
  }

  async enterRespondantDetailsJourney(workAddress: string, doYouHaveAcas: string): Promise<void> {
    await this.webAction.verifyTextIsVisible("What is the name of the respondent you're making the claim against?");
    await this.webAction.fillField('#respondentName', 'Gabby Greta');
    await this.clickSaveAndContinue();

    await this.webAction.waitForElementToBeVisible('#respondentEnterPostcode');
    await this.webAction.fillField('#respondentEnterPostcode', 'LS7 4QE');
    await this.clickSaveAndContinue();

    await this.webAction.waitForElementToBeVisible('#respondentAddressTypes');
    await this.webAction.verifyTextIsVisible('text=Select an address');
    await this.webAction.verifyTextIsVisible('text=Several addresses found');

    await this.webAction.selectByLabelFromDropDown('#respondentAddressTypes', '7, Valley Gardens, Leeds, LS7 4QE');
    await this.clickSaveAndContinue();

    await this.webAction.verifyTextIsVisible('What is the address of Gabby Greta?');
    await this.clickSaveAndContinue();

    await this.webAction.verifyTextIsVisible('Did you work at');
    if (workAddress === 'Yes') {
      await this.webAction.checkElementById('#work-address');
      await this.clickSaveAndContinue();
      await this.webAction.verifyTextIsVisible('Do you have an Acas number?');
    } else if (workAddress === 'No') {
      await this.webAction.checkElementById('#work-address-2');
      await this.clickSaveAndContinue();

      await this.webAction.waitForElementToBeVisible('#workEnterPostcode');
      await this.webAction.fillField('#workEnterPostcode', 'LS14 1AR');
      await this.clickSaveAndContinue();

      await this.webAction.verifyTextIsVisible('text=Select an address');
      await this.webAction.verifyTextIsVisible('text=Several addresses found');
      await this.webAction.selectByLabelFromDropDown('#workAddressTypes', '25, Ringwood Drive, Leeds, LS14 1AR');
      await this.clickSaveAndContinue();

      await this.webAction.verifyTextIsVisible('What address did you work at?');
      await this.clickSaveAndContinue();
    }

    //select yes or no for acas certificate
    if (doYouHaveAcas === 'Yes') {
      await this.webAction.waitForElementToBeVisible('#acasCert');
      await this.webAction.checkElementById('#acasCert');
      await this.webAction.fillField('#acasCertNum', 'R123456/12/23');
      await this.clickSaveAndContinue();
    } else if (doYouHaveAcas === 'No') {
      await this.webAction.waitForElementToBeVisible('#acasCert-2');
      await this.webAction.checkElementById('#acasCert-2');
      await this.clickSaveAndContinue();
      await this.webAction.verifyTextIsVisible(
        'text=Please note: incorrectly claiming an exemption may lead to your claim being rejected. If in doubt, please contact Acas.'
      );
      await this.webAction.verifyTextIsVisible('text=Why do you not have an Acas number?');
      await this.webAction.checkElementById('#no-acas-reason');
      await this.clickSaveAndContinue();
    }

    //check respondent details page
    await this.webAction.verifyTextIsVisible('text=Check the respondent details');
    await this.clickSaveAndContinue();

    //confirm completed section
    await this.webAction.verifyTextIsVisible('text=Have you completed this section?');
    await this.webAction.checkElementById('#tasklist-check');
    await this.clickSaveAndContinue();
    await this.delay(5000);
  }
}
