const { I } = inject();
function initialPageFlow() {
  I.amOnPage('/');
  I.see('Make a claim to an employment tribunal');
  I.click('Start now');
  I.see('Before you continue');
  I.click('Continue');
}

module.exports = { initialPageFlow };
