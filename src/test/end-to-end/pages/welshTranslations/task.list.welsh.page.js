const { I } = inject();

module.exports = {
  processPostLoginPagesForTheDraftApplication() {
    this.newAccountLanding();
    this.stepsToMakeClaim();
  },

  //select continue on the /new-account-landing page
  newAccountLanding() {
    I.see('Nid oes rhaid i chi lenwi’r ffurflen hawlio i gyd ar unwaith');
    I.click('Parhau');
  },

  //Verify Steps to making your claim page
  stepsToMakeClaim() {
    I.see('Camau i wneud eich hawliad');
    I.see('Gwahaniaethu');
    I.see('Chwythu’r chwiban');
  },
};
