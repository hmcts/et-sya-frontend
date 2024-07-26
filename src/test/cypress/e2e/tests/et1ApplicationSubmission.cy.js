import testConfig from '../../fixtures/config.json';
import LandingPage from '../../pages/LandingPage';
import LoginPage from '../../pages/LoginPage.js';
import PersonalDetailsPage from '../../pages/PersonalDetailsPage.js';
import EmploymentDetailsPage from '../../pages/employmentDetailsPage.js';

const Chance = require('chance');
const chance = new Chance();

let firstName = chance.first();
let ssn4 = chance.ssn({ ssnFour: true });
let lastName = chance.last();
let word = chance.word({ syllables: 3 });
const emailAddress = firstName + '.' + lastName + ssn4 + '@mail.com';
const genPassword = 'Test' + word + ssn4;
const workPostCode = 'LS7 4QE';
const selectedWorkAddress = '7, Valley Gardens, Leeds, LS7 4QE';
const firstLineOfAddress = '7, Valley Gardens?';

describe('Claimant Submit ET1 Application', () => {
  beforeEach(() => {
    cy.createAccount(firstName, lastName, emailAddress, genPassword);
    cy.visit(testConfig.submit_your_et1_application_url);
  });
  it('Scotland Applicaton - Working Notice', () => {
    // scotland
    const username = emailAddress;
    const password = genPassword;
    const landingPage = new LandingPage();
    const loginPage = new LoginPage();
    const personalDetailsPage = new PersonalDetailsPage();
    const employmentDetailsPage = new EmploymentDetailsPage();
    landingPage.completePreloginDraft('LS5 1AA', 'Claimant Representing Self', 'Yes');
    loginPage.loginToContinueET1Application(username, password);
    personalDetailsPage.prePersonalDetailsFlow();
    personalDetailsPage.completePersonalDetail();
    personalDetailsPage.completeClaimantHomeAddress();
    personalDetailsPage.completeCommunicationPreference();
    employmentDetailsPage.completeStillWorkingJourney(
      'Yes',
      'Still working for respondent',
      'Yes',
      workPostCode,
      selectedWorkAddress,
      firstLineOfAddress
    );
  });
});
