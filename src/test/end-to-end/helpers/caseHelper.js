async function doNotHaveToCompleteCard(I) {
  await I.youCanSaveCard();
}

async function didYouWorkForOrganisation(I, orgOption) {
  await I.didYouWorkForOrganisation(orgOption);
}

module.exports = {
  doNotHaveToCompleteCard,
  didYouWorkForOrganisation,
};
