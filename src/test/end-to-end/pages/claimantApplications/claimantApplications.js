'use strict';

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.see('ET1 Claims');
  I.see('Start a new claim');
  I.see('Draft Claims');
  I.see("For privacy purposes, a draft claim will be deleted 12 months after the date it's created.");
  I.see('Submitted Claims');
  I.click("//table[2]//tr[1]//a[.='View']");
};
