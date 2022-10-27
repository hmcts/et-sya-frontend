import { getById, hidden } from '../selectors';

export const showError = (id: string): void => {
  const addressErrorSummary = getById('addressErrorSummary');
  addressErrorSummary?.classList.remove(hidden);
  getById(id)?.classList.remove(hidden);
  const address1 = document.getElementsByClassName('address1');
  if (address1[0].classList.contains('hidden')) {
    const govUkFormGroup = getPostCodeInputForm();
    if (govUkFormGroup !== null) {
      govUkFormGroup.classList?.add('govuk-form-group--error');
    }
    const postCode = document.getElementById('postcode');
    postCode?.classList?.add('govuk-input--error');
    const postcodeError = document.getElementById('postcode-error');
    postcodeError?.classList?.remove('hidden');
  }
  addressErrorSummary?.focus();
  if (addressErrorSummary !== null) {
    addressErrorSummary.autofocus = true;
  }
};

function getPostCodeInputForm(): HTMLElement {
  const govUkFormGroups = document.getElementsByClassName('govuk-form-group');
  if (govUkFormGroups !== null && govUkFormGroups.length > 0) {
    return <HTMLElement>govUkFormGroups[0];
  }
  return null;
}

export const hideErrors = (): void => {
  [
    'errorPostCodeRequired',
    'errorPostCodeInvalid',
    'errorAddressNotSelected',
    'address1-error',
    'addressTown-error',
    'addressCountry-error',
    'addressErrorSummary',
  ].forEach(el => {
    getById(el)?.classList.add(hidden);
  });
  ['address1', 'addressTown', 'addressCountry'].forEach(el => {
    getById(el)?.classList.remove('govuk-input--error');
    getById(el)?.removeAttribute('aria-describedby');
  });
  Array.prototype.forEach.call(document.getElementsByClassName('govuk-form-group--error'), function (el: HTMLElement) {
    el.classList.remove('govuk-form-group--error');
  });
  const govUkFormGroup = getPostCodeInputForm();
  if (govUkFormGroup !== null) {
    govUkFormGroup.classList?.remove('govuk-form-group--error');
  }
  const postCode = document.getElementById('postcode');
  postCode?.classList?.remove('govuk-input--error');
  const postcodeError = document.getElementById('postcode-error');
  postcodeError?.classList?.add('hidden');
};
