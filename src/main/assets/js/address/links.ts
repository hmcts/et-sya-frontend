import { getById, hidden, qs, qsa } from '../selectors';

import { hideErrors } from './errors';

export const hideEnterPostcode = (): void => getById('enterPostcode').classList.add(hidden);
export const showEnterPostcode = (): void => getById('enterPostcode').classList.remove(hidden);

const hideSelectAddress = () => getById('selectAddress').classList.add(hidden);

const resetSelectAddress = () => {
  const selectAddress = getById('selectAddressInput') as HTMLSelectElement | null;
  if (selectAddress) {
    const defaultOpt = selectAddress[0];
    while (selectAddress.options.length > 0) {
      selectAddress.remove(0);
    }
    selectAddress.add(defaultOpt);
  }
};

export const showUkAddressFields = (): void => {
  getById('selectAddress').classList.add(hidden);
  qs('.govuk-form-group.address1').classList.remove(hidden);
  qs('.govuk-form-group.address2').classList.remove(hidden);
  qs('.govuk-form-group.addressTown').classList.remove(hidden);
  qs('.govuk-form-group.addressCounty').classList.remove(hidden);
  qs('.govuk-form-group.addressPostcode').classList.remove(hidden);
  getById('main-form-submit').classList.remove(hidden);
  getById('main-form-save-for-later').classList.remove(hidden);
};

export const hideUkAddressFields = (): void => {
  getById('selectAddress').classList.add(hidden);
  qs('.govuk-form-group.address1').classList.add(hidden);
  qs('.govuk-form-group.address2').classList.add(hidden);
  qs('.govuk-form-group.addressTown').classList.add(hidden);
  qs('.govuk-form-group.addressCounty').classList.add(hidden);
  qs('.govuk-form-group.addressPostcode').classList.add(hidden);
  getById('main-form-submit').classList.add(hidden);
  getById('main-form-save-for-later').classList.add(hidden);
};

const cannotFindAddress = getById('cannotFindAddress') as HTMLAnchorElement;
if (cannotFindAddress) {
  cannotFindAddress.onclick = e => {
    e.preventDefault();
    hideErrors();
    showUkAddressFields();
  };
}

const onResetPostcodeLookup = (e: UIEvent) => {
  e.preventDefault();
  hideErrors();
  resetSelectAddress();
  hideSelectAddress();
  hideUkAddressFields();

  for (const el of qsa('.govuk-error-summary:not([id="addressErrorSummary"])')) {
    el.remove();
  }

  showEnterPostcode();
};

const resetPostcodeLookupLinks = qsa('[data-link="resetPostcodeLookup"]') as NodeListOf<HTMLElement>;
if (resetPostcodeLookupLinks) {
  for (const el of resetPostcodeLookupLinks) {
    el.onclick = onResetPostcodeLookup;
  }
}

const postcodeEntry = getById('enterPostcode');

const backLink = qs('.govuk-back-link');
if (postcodeEntry && backLink) {
  backLink.onclick = function (e) {
    e.preventDefault();
    const notOnPostcodeEntry = postcodeEntry.classList.contains(hidden);
    if (notOnPostcodeEntry) {
      (e.target as HTMLAnchorElement).blur();
      onResetPostcodeLookup(e);
    } else {
      history.go(-1);
    }
  };
}
