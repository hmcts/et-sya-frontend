import { getById, hidden } from '../selectors';

import { hideErrors, showError } from './errors';

const selectAddressInput = getById('selectAddressInput') as HTMLInputElement | null;
if (selectAddressInput) {
  const updateAddressInputs = () => {
    const selectedValue = selectAddressInput.value;
    if (selectedValue !== '-1') {
      const selectedAddress = JSON.parse(selectedValue);
      (getById('address1') as HTMLInputElement).value = selectedAddress.street1;
      (getById('address2') as HTMLInputElement).value = selectedAddress.street2;
      (getById('addressTown') as HTMLInputElement).value = selectedAddress.town;
      (getById('addressCountry') as HTMLInputElement).value = selectedAddress.country;
      (getById('addressPostcode') as HTMLInputElement).value = selectedAddress.postcode;
      getById('main-form-submit').classList.remove(hidden);
      getById('main-form-save-for-later').classList.remove(hidden);
    } else {
      getById('main-form-submit').classList.add(hidden);
      getById('main-form-save-for-later').classList.add(hidden);
    }
  };

  selectAddressInput.onchange = updateAddressInputs;

  (getById('main-form') as HTMLFormElement).onsubmit = () => {
    hideErrors();

    if (!getById('selectAddress')?.classList.contains(hidden) && selectAddressInput.value === '-1') {
      showError('errorAddressNotSelected');
      return false;
    }

    return true;
  };
}
