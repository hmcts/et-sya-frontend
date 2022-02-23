import { hideUkAddressFields, showEnterPostcode } from './address/links';
import { getById } from './selectors';

import './address/submit';
import './address/select';

const form = getById('main-form') as HTMLFormElement | null;
if (form && getById('enterPostcode')) {
  showEnterPostcode();
  hideUkAddressFields();
}
