import { getById, hidden, qs, qsa } from '../selectors';

import { hideErrors } from './errors';

export const hideEnterPostcode = (): void => getById('enterPostcode').classList.add(hidden);
export const showEnterPostcode = (): void => getById('enterPostcode').classList.remove(hidden);

const hideSelectAddress = () => getById('selectAddress').classList.add(hidden);

const resetSelectAddress = () => {
  const selectAddress = getById('selectAddressInput') as HTMLSelectElement | null;
  if (selectAddress && selectAddress.length > 0) {
    const defaultOpt = selectAddress[0];
    while (selectAddress.options.length > 0) {
      selectAddress.remove(0);
    }
    selectAddress.add(defaultOpt);
  }
};

export const resetAddressFields = (): void => {
  (getById('address1') as HTMLInputElement).value = '';
  (getById('address2') as HTMLInputElement).value = '';
  (getById('addressTown') as HTMLInputElement).value = '';
  (getById('addressCountry') as HTMLInputElement).value = '';
  (getById('addressPostcode') as HTMLInputElement).value = '';
};

export const showUkAddressFields = (): void => {
  getById('selectAddress').classList.add(hidden);
  qs('.govuk-form-group.address1').hidden = false;
  qs('.govuk-form-group.address1').classList.remove(hidden);
  qs('.govuk-form-group.address2').hidden = false;
  qs('.govuk-form-group.address2').classList.remove(hidden);
  qs('.govuk-form-group.addressTown').hidden = false;
  qs('.govuk-form-group.addressTown').classList.remove(hidden);
  qs('.govuk-form-group.addressCountry').hidden = false;
  qs('.govuk-form-group.addressCountry').classList.remove(hidden);
  qs('.govuk-form-group.addressPostcode').hidden = false;
  qs('.govuk-form-group.addressPostcode').classList.remove(hidden);
  getById('main-form-submit').classList.remove(hidden);
  getById('main-form-save-for-later').classList.remove(hidden);
};

export const hideUkAddressFields = (): void => {
  getById('selectAddress').classList.add(hidden);
  qs('.govuk-form-group.address1').hidden = true;
  qs('.govuk-form-group.address1').classList.add(hidden);
  qs('.govuk-form-group.address2').hidden = true;
  qs('.govuk-form-group.address2').classList.add(hidden);
  qs('.govuk-form-group.addressTown').hidden = true;
  qs('.govuk-form-group.addressTown').classList.add(hidden);
  qs('.govuk-form-group.addressCountry').hidden = true;
  qs('.govuk-form-group.addressCountry').classList.add(hidden);
  qs('.govuk-form-group.addressPostcode').hidden = true;
  qs('.govuk-form-group.addressPostcode').classList.add(hidden);
  getById('main-form-submit').classList.add(hidden);
  getById('main-form-save-for-later').classList.add(hidden);
};

const onManualAddress = (e: UIEvent) => {
  e.preventDefault();
  hideErrors();
  hideEnterPostcode();
  showUkAddressFields();
};

const cannotFindAddress = getById('cannotFindAddress') as HTMLAnchorElement;
const manualAddress = getById('manualAddress') as HTMLAnchorElement;

if (cannotFindAddress) {
  cannotFindAddress.onclick = onManualAddress;
}

if (manualAddress) {
  manualAddress.onclick = onManualAddress;
}

const onResetPostcodeLookup = (e: UIEvent) => {
  e.preventDefault();
  hideErrors();
  resetSelectAddress();
  hideSelectAddress();
  resetAddressFields();
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
