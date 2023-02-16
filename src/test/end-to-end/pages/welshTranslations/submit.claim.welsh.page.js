const { I } = inject();

module.exports = {
  async submitClaim() {
    this.clickCheckYourAnswersLink();
    this.noPcqQuestions();
    this.clickSubmitOnCheckYourAnswers();
    return this.verifyClaimSubmitted();
  },
  //user clicks check your answers link
  clickCheckYourAnswersLink() {
    I.waitForElement('[href="/pcq?lng=cy"]', 30);
    I.click('[href="/pcq?lng=cy"]');
  },
  //
  noPcqQuestions() {
    I.waitForText('Equality and diversity questions', 30);
    I.click('[name=opt-out-button]');
  },
  clickSubmitOnCheckYourAnswers() {
    I.waitForText('Gwiriwch eich atebion', 30);
    I.click('Cyflwyno');
  },

  async verifyClaimSubmitted() {
    I.waitForText('Mae eich hawliad wedi ei gyflwyno', 30);
    const submissionRef = (await I.grabTextFrom('//*[@id="main-content"]/div[1]/div/dl[1]/div[1]/dd')).trim();
    console.log(submissionRef);
    I.see('Hawliad wedi’i gyflwyno');
    const date = new Date();
    const formattedDate = date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    I.see(formattedDate);
    return submissionRef;
  },
};
