import { isInvalidPostcode } from '../../../components/form/validator';
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
    document.body.style.cursor = 'wait';
    findAddressButton.style.cursor = 'wait';
    if (e.submitter.id !== 'saveAsDraftButton') {
      const isPostCodeInvalid = isInvalidPostcode(postcode);

      if (isPostCodeInvalid) {
        if (isPostCodeInvalid === 'required') {
          showError('errorPostCodeRequired');
        } else {
          showError('errorPostCodeInvalid');
        }
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
    } else {
      await fetch('/address-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _csrf: formData.get('_csrf'), saveForLater: true, postcode }),
      });
    }
  };
}
