import { isValidUKPostcode } from '../../../components/form/address_validator';
import { PageUrls } from '../../../definitions/constants';
import locales from '../../../resources/locales/en/translation/enter-address.json';
import { getById, hidden } from '../selectors';
import { focusToGovUKErrorDiv } from '../set-focus';

import { hideErrors, showError } from './errors';

const postcodeLookupForm = getById('postcodeLookup') as HTMLFormElement | null;
const findAddressButton = getById('findAddressButton') as HTMLInputElement | null;
const saveAsDraftButton = getById('saveAsDraftButton') as HTMLInputElement | null;
const selectAddress = getById('selectAddressInput') as HTMLSelectElement | null;

if (postcodeLookupForm && findAddressButton && selectAddress) {
  const addressErrorSummary = document.getElementById('addressErrorSummary');
  if (addressErrorSummary.classList.contains('hidden')) {
    const govUkFormGroups = document.getElementsByClassName('govuk-form-group');
    if (govUkFormGroups !== null && govUkFormGroups.length > 0) {
      govUkFormGroups[0]?.classList?.remove('govuk-form-group--error');
    }
    const postCode = document.getElementById('postcode');
    postCode?.classList?.remove('govuk-input--error');
    const postcodeError = document.getElementById('postcode-error');
    postcodeError?.classList?.add('hidden');
  }

  postcodeLookupForm.onsubmit = async function (e) {
    e.preventDefault();
    hideErrors();
    const formData = new FormData(postcodeLookupForm);
    const postcode = formData.get('postcode')?.toString() || '';
    document.body.style.cursor = 'wait';
    findAddressButton.style.cursor = 'wait';
    saveAsDraftButton.style.cursor = 'wait';
    if (e.submitter.id !== 'saveAsDraftButton') {
      const isPostCodeInvalid = isValidUKPostcode(postcode, null);

      if (isPostCodeInvalid) {
        if (isPostCodeInvalid === 'required') {
          showError('errorPostCodeRequired');
        } else {
          showError('errorPostCodeInvalid');
        }
        activateCursorButtons();
        focusToGovUKErrorDiv();
        return;
      }
      try {
        const response = await fetch('/address-lookup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _csrf: formData.get('_csrf'), postcode }),
        });
        const addresses = await response.json();

        getById('userPostcode').textContent = postcode;

        selectAddress.remove(0);
        const placeholder = document.createElement('option');
        placeholder.value = '-1';
        if (addresses.length === 0) {
          placeholder.text = locales.selectDefaultNone;
        } else if (addresses.length === 1) {
          placeholder.text = locales.selectDefaultSingle;
        } else {
          placeholder.text = locales.selectDefaultSeveral;
        }
        selectAddress.add(placeholder);

        for (const address of addresses) {
          const addressOption = document.createElement('option');
          addressOption.value = JSON.stringify(address);
          addressOption.text = address.fullAddress;
          selectAddress.add(addressOption);
        }
      } finally {
        activateCursorButtons();
        getById('enterPostcode').classList.add(hidden);
        getById('selectAddress').classList.remove(hidden);
        selectAddress.focus();
      }
    } else {
      try {
        await fetch('/address-lookup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _csrf: formData.get('_csrf'), saveForLater: true, postcode }),
        });
      } finally {
        activateCursorButtons();
        window.location.href = PageUrls.CLAIM_SAVED;
      }
    }
  };
}

function activateCursorButtons() {
  document.body.style.cursor = 'default';
  findAddressButton.style.cursor = 'pointer';
  saveAsDraftButton.style.cursor = 'pointer';
}
