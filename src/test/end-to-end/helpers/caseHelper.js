async function doNotHaveToCompleteCard(I) {
  await I.youCanSaveCard();
}

async function didYouWorkForOrganisation(I, orgOption) {
  await I.didYouWorkForOrganisation(orgOption);
}

async function personalDetails(I) {
  await I.personalDetails();
}

module.exports = {
  doNotHaveToCompleteCard,
  didYouWorkForOrganisation,
  personalDetails,
};
