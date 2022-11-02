import { getById, hidden } from '../selectors';

export const showError = (id: string): void => {
  getById('addressErrorSummary')?.classList.remove(hidden);
  getById(id)?.classList.remove(hidden);
};

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
};
