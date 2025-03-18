// import {test as StepFactory } from '@playwright/test';
// import { BundleSteps } from '../steps/bundleSteps';
// import CreateCaseStep from '../steps/createAndAcceptCase';
// import  ReferralSteps from '../steps/referralSteps';
// import JudgementSteps from '../steps/judgementSteps';


// export type StepFixtures = {

//     createCaseStep: CreateCaseStep;
//     bundleSteps: BundleSteps;
//     referralSteps: ReferralSteps;
//     judgementSteps: JudgementSteps;
// }

// export const stepFixtures = {

//     createCaseStep: async ({ page }, use) => {
//         await use(new CreateCaseStep(page));
//     },

//     bundleSteps: async ({ page }, use) => {
//         await use(new BundleSteps(page));
//     },

//     referralSteps: async ({ page }, use) => {
//         await use(new ReferralSteps(page));
//     },

//     judgementSteps: async ({ page }, use) => {
//         await use(new JudgementSteps(page));
//     }
    
// };