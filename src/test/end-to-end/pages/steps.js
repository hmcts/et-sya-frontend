'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = () => {
  return actor({
    authenticateWithIdam: steps.IDAM.signin,
    youCanSaveCard: steps.saveDraft.youCanSaveCard,
    didYouWorkForOrganisation: steps.employmentDetails.didYouWorkForOrg,
    personalDetails: steps.personalDetails.personalDetails,
    stepsToMakingYourClaim: steps.stepsToMakingYourClaim.stepsToMakingYourClaim,
    typeOfDiscrimination: steps.typeOfDiscrimination.typeOfDisc,
    whatHappenedToYou: steps.whatHappenedToYou.whatHappened,
    ifClaimWasSuccessfull: steps.ifClaimWasSuccessfull.ifClaimWasSuccessfull,
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
