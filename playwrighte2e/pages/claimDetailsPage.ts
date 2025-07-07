import { BasePage } from './basePage';

export class ClaimDetailsPage extends BasePage {
  async claimDet(allClaimDetailsPages = true): Promise<void> {
    if (allClaimDetailsPages) {
      await this.webAction.checkElementById('#discrimination');
      await this.webAction.checkElementById('#whistleBlowing');
      await this.clickContinue();

      await this.webAction.verifyTextIsVisible('text=What type of discrimination are you claiming?');
      await this.webAction.verifyTextIsVisible('text=Select all that apply.');
      await this.webAction.verifyTextIsVisible('text=Age');
      await this.webAction.verifyTextIsVisible('text=Disability');
      await this.webAction.verifyTextIsVisible('text=Gender reassignment');
      await this.webAction.verifyTextIsVisible('text=Marriage or civil partnership');
      await this.webAction.verifyTextIsVisible('text=Pregnancy or maternity');
      await this.webAction.verifyTextIsVisible(
        'text=Race (including colour, nationality, and ethnic or national origins)'
      );
      await this.webAction.verifyTextIsVisible('text=Religion or belief');
      await this.webAction.verifyTextIsVisible('text=Sex (including equal pay)');
      await this.webAction.verifyTextIsVisible('text=Sexual orientation');

      // await this.webAction.clickElementByLabel('What is discrimination?');
      // await this.webAction.verifyTextIsVisible('text=This is your opportunity to explain what happened to you and why you believe it was discrimination.');

      await this.webAction.checkElementById('#age');
      await this.webAction.checkElementById('#disability');
      await this.webAction.checkElementById('#genderReassignment');
      await this.webAction.checkElementById('#marriageOrCivilPartnership');
      await this.webAction.checkElementById('#pregnancyOrMaternity');
      await this.webAction.checkElementById('#race');
      await this.webAction.checkElementById('#religionOrBelief');
      await this.webAction.checkElementById('#sex');
      await this.webAction.checkElementById('#sexualOrientation');
      await this.clickSaveAndContinue();

      await this.webAction.verifyTextIsVisible('text=Describe what happened to you');
      await this.webAction.verifyTextIsVisible('text=What to write for discrimination claims');
      await this.webAction.verifyTextIsVisible('text=What to write for dismissal claims');
      await this.webAction.verifyTextIsVisible('text=What to write for whistleblower claims');
      await this.webAction.verifyTextIsVisible("text=What to write for 'other' claims");
      await this.webAction.verifyTextIsVisible(
        'text=Use this box to describe the events around your dispute, or add to your claim by uploading a document'
      );
      await this.webAction.verifyTextIsVisible('text=Or upload your summary as a separate document (optional)');

      await this.page.locator('summary span').nth(0).click();

      // await this.webAction.clickElementByText('text=What to write for discrimination claims ');
      await this.webAction.verifyTextIsVisible('text=Describe the events you are complaining about.');
      await this.webAction.verifyTextIsVisible(
        'text=Try to give the dates of the events (and set them out in date order) and the'
      );
      await this.webAction.verifyTextIsVisible(
        'text=names of other people involved. Explain, as best you can, why you consider'
      );
      await this.webAction.verifyTextIsVisible(
        'text=that these events mean that you have been unlawfully discriminated'
      );
      await this.webAction.verifyTextIsVisible(
        'text=against, by reference to the protected characteristics you rely on.'
      );

      // await this.webAction.clickElementByText('text=What to write for dismissal claims ');
      await this.page.locator('summary span').nth(1).click();
      await this.webAction.verifyTextIsVisible('text=Describe the circumstances of your dismissal.');
      await this.webAction.verifyTextIsVisible(
        'text=Try to give the dates of the events (like dismissal meetings) and the names'
      );
      await this.webAction.verifyTextIsVisible(
        'text=of others involved (such as the person who dismissed you). You should ex'
      );
      await this.webAction.verifyTextIsVisible(
        'text=plain, as best you can, why you consider that your dismissal was unfair.'
      );

      // await this.webAction.clickElementByText('text=What to write for whistleblower claims ');
      await this.page.locator('summary span').nth(2).click();
      await this.webAction.verifyTextIsVisible(
        'text=Give the dates of each time you say you "blew the whistle" by making a'
      );
      await this.webAction.verifyTextIsVisible(
        'text=protected disclosure. For each disclosure summarise the information you'
      );
      await this.webAction.verifyTextIsVisible(
        'text=disclosed, whether it was done verbally or in writing, the person to whom'
      );
      await this.webAction.verifyTextIsVisible(
        'text=you made the disclosure, what kind of wrongdoing you were disclosing,'
      );
      await this.webAction.verifyTextIsVisible('text=and why the disclosure was in the public interest.');
      await this.webAction.verifyTextIsVisible(
        'text=Explain how you were treated detrimentally (which can include being dismissed) because of the disclosure(s), giving dates and summarising the incidents.'
      );
      await this.webAction.verifyTextIsVisible('text=Describe how you’ve been affected by the detrimental treatment.');

      // await this.webAction.clickElementByText("text=What to write for 'other' claims ");
      await this.page.locator('summary span').nth(3).click();
      await this.webAction.verifyTextIsVisible(
        'text=The tribunal can only hear cases where legislation gives it power to do so.'
      );
      await this.webAction.verifyTextIsVisible(
        'text=Explain briefly, if you can, what legislation you say covers this claim.'
      );
      await this.webAction.verifyTextIsVisible(
        'text=Even if you cannot, the most important thing is to explain what was done'
      );
      await this.webAction.verifyTextIsVisible(
        'text=and, so far as you can, why you say it was unlawful. Give dates and brief'
      );
      await this.webAction.verifyTextIsVisible(
        'text=details of each incident, including the name of the person responsible.'
      );

      // await this.webAction.clickElementByText('text=Or upload your summary as a separate document (optional)');
      await this.page.locator('summary span').nth(4).click();
      await this.webAction.verifyTextIsVisible('text=You can only upload 1 document.');
      await this.webAction.verifyTextIsVisible('text=Upload a file');
      await this.webAction.fillField('#claim-summary-text', 'Discrimination, Dismissal and Pay Cut');
      await this.clickSaveAndContinue();

      //If your claim was successfull page.
      await this.webAction.verifyTextIsVisible('text=What do you want if your claim is successful? (optional)');
      await this.webAction.verifyTextIsVisible('text=Compensation - what can a tribunal award?');
      await this.webAction.verifyTextIsVisible('text=What is a tribunal recommendation?');
      await this.webAction.verifyTextIsVisible('text=Select all that apply.');
      await this.webAction.verifyTextIsVisible('text=Compensation only');
      await this.webAction.verifyTextIsVisible('text=You’ll be asked to provide an estimate of total compensation');
      await this.webAction.verifyTextIsVisible('text=If claiming discrimination, a tribunal recommendation');
      await this.webAction.verifyTextIsVisible('text=You’ll be asked to describe your request to the tribunal');
      await this.webAction.verifyTextIsVisible(
        'text=If claiming unfair dismissal, to get your old job back and compensation'
      );
      await this.webAction.verifyTextIsVisible(
        'text=If claiming unfair dismissal, to get another job with the same employer or associated employer and compensation (re-engagement)'
      );

      // await this.webAction.clickElementByText('text=Compensation - what can a tribunal award?');
      await this.page.locator('summary span').nth(0).click();
      await this.webAction.verifyTextIsVisible(
        'text=If a tribunal decides you’ve been unfairly dismissed, you’ll normally receive'
      );
      await this.webAction.verifyTextIsVisible('text=compensation which is made up of:');
      await this.webAction.verifyTextIsVisible('text=a basic award - fixed sum worked out using a standard formula');
      await this.webAction.verifyTextIsVisible(
        'text=a compensatory award - compensation for the actual money you lost'
      );
      await this.webAction.verifyTextIsVisible(
        'text=due to your dismissal, or which you expect to lose in future because of'
      );
      await this.webAction.verifyTextIsVisible('text=your dismissal');
      await this.webAction.verifyTextIsVisible(
        'text=Compensation can be reduced for various reasons and a tribunal will tell you'
      );
      await this.webAction.verifyTextIsVisible('text=more about this if it applies in your specific circumstances.');
      await this.webAction.verifyTextIsVisible(
        'text=In disciplinary or grievance cases, you may be entitled to an increased award'
      );
      await this.webAction.verifyTextIsVisible(
        'text=if an employer fails to follow the guidance set out in the Acas Code of'
      );
      await this.webAction.verifyTextIsVisible(
        'text=Practice on disciplinary and grievance procedures (opens in new tab).'
      );
      await this.webAction.verifyTextIsVisible(
        "text=Similarly, awards can be reduced if a tribunal decides you've failed to follow"
      );
      await this.webAction.verifyTextIsVisible(
        'text=the guidance set out in the Acas Code of Practice on disciplinary and grievance procedures (opens in new tab).'
      );
      await this.webAction.verifyTextIsVisible(
        'text=In certain claims, such as those involving discrimination, a tribunal may com'
      );
      await this.webAction.verifyTextIsVisible(
        "text=pensate you for 'injury to feelings' (individual hurt and distress you may have"
      );
      await this.webAction.verifyTextIsVisible('text=suffered) in addition to compensation for financial loss.');

      // await this.webAction.clickElementByText('text=What is a tribunal recommendation?');
      await this.page.locator('summary span').nth(1).click();
      await this.webAction.verifyTextIsVisible(
        'text=If your employer is found to have discriminated against you, a tribunal can'
      );
      await this.webAction.verifyTextIsVisible(
        'text=make a recommendation that the respondent take specific steps to reduce'
      );
      await this.webAction.verifyTextIsVisible('text=the effect of the discrimination on you');

      await this.webAction.checkElementById('#compensationOnly');
      await this.webAction.checkElementById('#tribunalRecommendation');
      await this.webAction.checkElementById('#oldJob');
      await this.webAction.checkElementById('#anotherJob');

      await this.clickSaveAndContinue();
      await this.webAction.verifyTextIsVisible('text=What compensation are you seeking?');

      await this.webAction.verifyTextIsVisible('text=Compensation - what can a tribunal award?');
      await this.webAction.verifyTextIsVisible(
        'text=Try to set out all compensation you’re claiming for, and provide a total if possible'
      );
      await this.webAction.verifyTextIsVisible('text=Enter the total compensation amount you are requesting');

      // await this.webAction.clickElementByText('text=Compensation - what can a tribunal award?');
      await this.page.locator('summary span').nth(0).click();
      await this.webAction.verifyTextIsVisible(
        'text=If a tribunal decides you’ve been unfairly dismissed, you’ll normally receive'
      );
      await this.webAction.verifyTextIsVisible('text=compensation which is made up of:');
      await this.webAction.verifyTextIsVisible('text=a basic award - fixed sum worked out using a standard formula');
      await this.webAction.verifyTextIsVisible(
        'text=a compensatory award - compensation for the actual money you lost'
      );
      await this.webAction.verifyTextIsVisible(
        'text=due to your dismissal, or which you expect to lose in future because of'
      );
      await this.webAction.verifyTextIsVisible('text=your dismissal');
      await this.webAction.verifyTextIsVisible(
        'text=Compensation can be reduced for various reasons and a tribunal will tell you'
      );
      await this.webAction.verifyTextIsVisible('text=more about this if it applies in your specific circumstances.');
      await this.webAction.verifyTextIsVisible(
        'text=In disciplinary or grievance cases, you may be entitled to an increased award'
      );
      await this.webAction.verifyTextIsVisible(
        'text=if an employer fails to follow the guidance set out in the Acas Code of'
      );
      await this.webAction.verifyTextIsVisible(
        'text=Practice on disciplinary and grievance procedures (opens in new tab).'
      );
      await this.webAction.verifyTextIsVisible(
        "text=Similarly, awards can be reduced if a tribunal decides you've failed to follow"
      );
      await this.webAction.verifyTextIsVisible(
        'text=the guidance set out in the Acas Code of Practice on disciplinary and grievance procedures (opens in new tab).'
      );
      await this.webAction.verifyTextIsVisible(
        'text=In certain claims, such as those involving discrimination, a tribunal may com'
      );
      await this.webAction.verifyTextIsVisible(
        "text=pensate you for 'injury to feelings' (individual hurt and distress you may have"
      );
      await this.webAction.verifyTextIsVisible('text=suffered) in addition to compensation for financial loss.');

      await this.webAction.fillField('#compensationOutcome', 'Discrimination, Dismissal and Pay Cut.');
      await this.webAction.fillField('#compensation-amount', '1000.00');
      await this.clickSaveAndContinue();

      await this.webAction.verifyTextIsVisible('text=What tribunal recommendation would you like to make?');
      await this.webAction.verifyTextIsVisible('text=What is a tribunal recommendation?');
      await this.webAction.verifyTextIsVisible(
        'text=Tell us what action you’d like a tribunal to recommend your respondents take to'
      );
      await this.webAction.verifyTextIsVisible('text=reduce the impact of any discrimination which has occurred.');

      // await this.webAction.clickElementByText('text=What is a tribunal recommendation?');
      await this.page.locator('summary span').nth(0).click();
      await this.webAction.verifyTextIsVisible(
        'text=If your employer is found to have discriminated against you, a tribunal can'
      );
      await this.webAction.verifyTextIsVisible(
        'text=make a recommendation that the respondent take specific steps to reduce'
      );
      await this.webAction.verifyTextIsVisible('text=the effect of the discrimination on you');

      await this.webAction.fillField('#tribunalRecommendationRequest', 'Discrimination, Dismissal and Pay Cut.');
      await this.clickSaveAndContinue();

      await this.webAction.verifyTextIsVisible('text=Whistleblowing claims');
      await this.webAction.verifyTextIsVisible(
        'text=You’ve selected a whistleblowing claim, so you can request that we forward a'
      );
      await this.webAction.verifyTextIsVisible(
        'text=copy of your claim to a relevant regulator (also known as ‘prescribed person’) or'
      );
      await this.webAction.verifyTextIsVisible('text=body.');
      await this.webAction.verifyTextIsVisible(
        'text=We will notify the respondent if you choose for us to forward your claim but this'
      );
      await this.webAction.verifyTextIsVisible('text=will not affect how we process your claim');
      await this.webAction.verifyTextIsVisible(
        'text=Not all whistleblowing claims will have an appropriate regulator or body'
      );
      await this.webAction.verifyTextIsVisible(
        'text=Find the relevant regulator or body (opens in a new window) for your type of'
      );
      await this.webAction.verifyTextIsVisible('text=claim from this list');
      await this.webAction.verifyTextIsVisible(
        'text=Do you want us to forward your whistleblowing claim to a relevant'
      );
      await this.webAction.verifyTextIsVisible('text=regulator or body?');

      await this.webAction.checkElementById('#whistleblowing-claim');
      await this.webAction.fillField('#whistleblowing-entity-name', 'N/A');
      await this.clickSaveAndContinue();

      await this.webAction.verifyTextIsVisible('text=Linked cases');
      await this.webAction.verifyTextIsVisible(
        'text=Tell us if there are any existing cases this claim could be linked to.'
      );
      await this.webAction.verifyTextIsVisible('text=This could be:');
      await this.webAction.verifyTextIsVisible('text=a case or cases you have already brought');
      await this.webAction.verifyTextIsVisible(
        'text=a case or cases brought by other people against the same employer with the same or similar circumstances'
      );
      await this.webAction.verifyTextIsVisible(
        'text=This will help the tribunal consider whether the cases should be linked in any way.'
      );
      await this.webAction.verifyTextIsVisible(
        'text=Are there are any existing cases which may be linked to this new claim? (Optional)'
      );
      await this.webAction.verifyTextIsVisible('text=No');
      await this.webAction.verifyTextIsVisible('text=Yes');

      await this.webAction.checkElementById('#linkedCases-2');
      await this.clickSaveAndContinue();

      await this.webAction.verifyTextIsVisible('text=Have you completed this section?');
      await this.webAction.verifyTextIsVisible('text=You can change your answers later.');
      await this.webAction.verifyTextIsVisible("text=Yes, I've completed this section");
      await this.webAction.verifyTextIsVisible("text=No, I'll come back to it later");

      await this.webAction.checkElementById('#claim-details-check');
      await this.clickSaveAndContinue();
      await this.delay(5000);
    }
  }
}
