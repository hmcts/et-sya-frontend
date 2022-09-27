const { I } = inject();

async function verifyWhatIsDiscrimination() {
  I.see(
    "Discrimination is when you're treated unfairly and the treatment is related to any of the protected characteristics"
  );
  I.see('from the 2010 Equality Act. You have rights at work if you have experienced discrimination.');
  I.see('See the GOV.UK guidance (opens in new tab) for further information on protected characteristics and your');
  I.see('workplace rights.');
}

async function verifyThisIsYourOppurtunityToExplain() {
  I.see('This is your opportunity to explain why you are making a claim to an employment tribunal.');
  I.see(
    'It’s important you focus on setting out what happened to you and explain, as far as you can, why you think what'
  );
  I.see('happened was unlawful.');
  I.see('Your claim will be sent to the respondents who will have a chance to reply through the tribunal.');
  I.see('The tribunal will then decide (usually via a hearing) whether the respondents have acted unlawfully.');
  I.see(
    'We do not need detailed evidence, such as copies of emails, letters or other documents at this stage. Keep hold'
  );
  I.see('of these documents in case they are needed. You may need to bring them to a hearing.');
}

async function verifyWhatToWriteForDiscriminationClaims() {
  I.see('Describe the events you are complaining about.');
  I.see('Try to give the dates of the events (and set them out in date order) and the');
  I.see('names of other people involved. Explain, as best you can, why you consider');
  I.see('that these events mean that you have been unlawfully discriminated');
  I.see('against, by reference to the protected characteristics you rely on.');
}

async function verifyWhatToWriteForDismissalClaims() {
  I.see('Describe the circumstances of your dismissal.');
  I.see('Try to give the dates of the events (like dismissal meetings) and the names');
  I.see('of others involved (such as the person who dismissed you). You should ex');
  I.see('plain, as best you can, why you consider that your dismissal was unfair.');
}

async function verifyWhatToWriteForWhistleBlowerClaims() {
  I.see('Give the dates of each time you say you "blew the whistle" by making a');
  I.see('protected disclosure. For each disclosure summarise the information you');
  I.see('disclosed, whether it was done verbally or in writing, the person to whom');
  I.see('you made the disclosure, what kind of wrongdoing you were disclosing,');
  I.see('and why the disclosure was in the public interest.');
  I.see('Explain how you were treated detrimentally (which can include being dis');
  I.see('missed) because of the disclosure(s), giving dates and summarising the');
  I.see('incidents.');
  I.see('Describe how you’ve been affected by the detrimental treatment.');
}

async function verifyWhatToWriteForOtherClaims() {
  I.see('The tribunal can only hear cases where legislation gives it power to do so.');
  I.see('Explain briefly, if you can, what legislation you say covers this claim.');
  I.see('Even if you cannot, the most important thing is to explain what was done');
  I.see('and, so far as you can, why you say it was unlawful. Give dates and brief');
  I.see('details of each incident, including the name of the person responsible.');
}

async function verifyWhatCanATribunalAward() {
  I.see('Compensation - what can a tribunal award?');
  I.see('What is a tribunal recommendation?');
  I.see('Select all that apply.');
  I.see('Compensation only');
  I.see('You’ll be asked to provide an estimate of total compensation');
  I.see('If claiming discrimination, a tribunal recommendation');
  I.see('You’ll be asked to describe your request to the tribunal');
  I.see('If claiming unfair dismissal, to get your old job back and compensation');
  I.see('If claiming unfair dismissal, to get another job with the same employ');
  I.see('er or associated employer and compensation (re-engagement)');
}

async function verifyIfATribunalDecidesYouveBeenUnfairlyDismissed() {
  I.see("If a tribunal decides you've been unfairly dismissed, you'll normally receive");
  I.see('compensation which is made up of:');
  I.see('a basic award - fixed sum worked out using a standard formula');
  I.see('a compensatory award - compensation for the actual money you lost');
  I.see('due to your dismissal, or which you expect to lose in future because of');
  I.see('your dismissal');
  I.see('Compensation can be reduced for various reasons and a tribunal will tell you');
  I.see('more about this if it applies in your specific circumstances.');
  I.see('In disciplinary or grievance cases, you may be entitled to an increased award');
  I.see('if an employer fails to follow the guidance set out in the Acas Code of');
  I.see('Practice on disciplinary and grievance procedures.');
  I.see("Similarly, awards can be reduced if a tribunal decides you've failed to follow");
  I.see('the guidance set out in the Acas Code of Practice on disciplinary and griev');
  I.see('ance procedures.');
  I.see('In certain claims, such as those involving discrimination, a tribunal may com');
  I.see("pensate you for 'injury to feelings' (individual hurt and distress you may have");
  I.see('suffered) in addition to compensation for financial loss.');
}

async function verifyIfYourEmployerIsFound() {
  I.see('If your employer is found to have discriminated against you, a tribunal can');
  I.see('make a recommendation that the respondent take specific steps to reduce');
  I.see('the effect of the discrimination on you');
}

async function verifyWhatCanACompensationTribunalAward() {
  I.see('Compensation - what can a tribunal award?');
  I.see('Try to set out all compensation you’re claiming for, and provide a total if possible');
  I.see('Enter the total compensation amount you are requesting');
}

async function verifyWhatIsATribunalReccomendation() {
  I.see('What is a tribunal recommendation?');
  I.see('Tell us what action you’d like a tribunal to recommend your respondents take to');
  I.see('reduce the impact of any discrimination which has occurred.');
}

async function verifyIfYourEmployerIsFoundDiscriminated() {
  I.see('If your employer is found to have discriminated against you, a tribunal can');
  I.see('make a recommendation that the respondent take specific steps to reduce');
  I.see('the effect of the discrimination on you');
}

async function verifyWhistleBlowingClaims() {
  I.see("You've selected a whistleblowing claim, so you can request that we forward a");
  I.see("copy of your claim to a relevant regulator (also known as 'prescribed person') or");
  I.see('body.');
  I.see('We will notify the respondent if you choose for us to forward your claim but this');
  I.see('will not affect how we process your claim');
  I.see('Not all whistleblowing claims will have an appropriate regular or body');
  I.see('Find the relevant regulator or body (opens in a new window) for your type of');
  I.see('claim from this list');
  I.see('Do you want us to forward your whistleblowing claim to a relevant');
  I.see('regulator or body?');
}

module.exports = {
  verifyWhatIsDiscrimination,
  verifyThisIsYourOppurtunityToExplain,
  verifyWhatToWriteForDiscriminationClaims,
  verifyWhatToWriteForDismissalClaims,
  verifyWhatToWriteForWhistleBlowerClaims,
  verifyWhatToWriteForOtherClaims,
  verifyWhatCanATribunalAward,
  verifyIfATribunalDecidesYouveBeenUnfairlyDismissed,
  verifyIfYourEmployerIsFound,
  verifyWhatCanACompensationTribunalAward,
  verifyWhatIsATribunalReccomendation,
  verifyIfYourEmployerIsFoundDiscriminated,
  verifyWhistleBlowingClaims,
};
