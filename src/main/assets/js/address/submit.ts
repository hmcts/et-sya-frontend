import { isInvalidPostcode } from '../../../components/form/validator';
import locales from '../../../resources/locales/en/translation/enter-address.json';
import { getById, hidden } from '../selectors';

import { hideErrors, showError } from './errors';

const postcodeLookupForm = getById('postcodeLookup') as HTMLFormElement | null;
const findAddressButton = getById('findAddressButton') as HTMLInputElement | null;
const selectAddress = getById('selectAddressInput') as HTMLSelectElement | null;

if (postcodeLookupForm && findAddressButton && selectAddress) {
  postcodeLookupForm.onsubmit = async function (e) {
    e.preventDefault();

    hideErrors();

    const formData = new FormData(postcodeLookupForm);
    const postcode = formData.get('postcode')?.toString() || '';

    const isPostCodeInvalid = isInvalidPostcode(postcode);

    if (isPostCodeInvalid) {
      if (isPostCodeInvalid === 'required') {
        showError('errorPostCodeRequired');
      } else {
        showError('errorPostCodeInvalid');
      }
      return;
    }

    document.body.style.cursor = 'wait';
    findAddressButton.style.cursor = 'wait';

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
      document.body.style.cursor = 'default';
      findAddressButton.style.cursor = 'pointer';

      getById('enterPostcode').classList.add(hidden);
      getById('selectAddress').classList.remove(hidden);
      selectAddress.focus();
    }
  };
}
