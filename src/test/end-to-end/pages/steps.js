'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = () => {
  return actor({
    authenticateWithIdam: steps.IDAM.signin,
    youCanSaveCard: steps.saveDraft.youCanSaveCard,
    didYouWorkForOrganisation: steps.employmentDetails.didYouWorkForOrg,
    personalDetails: steps.personalDetails.enterPersonalDetails,
    areYouStillWorkingForOrganisation: steps.employmentDetails.areYouStillWorkingForOrg,
    stillWorkingJourney: steps.employmentDetails.stillWorkingPages,
    workingNoticePeriodJourney: steps.employmentDetails.workingNoticePeriodPages,
    noLongerWorkingJourney: steps.employmentDetails.noLongerWorkingPages,
    respondentDetailsJourney: steps.employmentDetails.respondentDetailsPages,
    stepsToMakingYourClaim: steps.stepsToMakingYourClaim.stepsToMakingYourClaim,
    claimDetails: steps.claimDetails.claimDet,
    submitClaim: steps.submitClaim.submitClaimPages,
  });
};

/*
const actions = {};

function setActorActions(data) {
  // eslint-disable-next-line no-console
  // console.log('Setting Action actions for data : '+JSON.stringify(data));
  for (const k in data) {
    if (data.hasOwnProperty(k)) {
      actions[k] = data[k];
    }
  }
}

function setActorActionsRecutssively(object) {
  const objKeys = Object.keys(object);

  // eslint-disable-next-line no-console
  // console.log('Set Action for object : '+JSON.stringify(object));
  for (const key in objKeys) {
    if (Object.keys(object[objKeys[key]]).length === 0) {
      setActorActions(object);
    } else {
      setActorActionsRecutssively(object[objKeys[key]]);
    }
  }
}

module.exports = function () {
  setActorActionsRecutssively(steps);
  // eslint-disable-next-line no-console
  // console.log('actions : '+JSON.stringify(actions));
  return actor(actions);
};
*/
