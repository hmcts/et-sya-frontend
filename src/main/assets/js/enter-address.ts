import { hideEnterPostcode, hideUkAddressFields, showEnterPostcode, showUkAddressFields } from './address/links';
import { getById, qsa } from './selectors';

import './address/submit';
import './address/select';

const form = getById('main-form') as HTMLFormElement | null;
if (form && getById('enterPostcode')) {
  const hasBackendError = qsa('.govuk-error-summary').length > 1;

  if (hasBackendError) {
    hideEnterPostcode();
    showUkAddressFields();
  } else {
    hideUkAddressFields();
    showEnterPostcode();
  }
}
