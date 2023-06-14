import { InterceptPaths } from '../../definitions/constants';

import { getById } from './selectors';

const submitCaseButton = getById('main-form-submit') as HTMLButtonElement | null;
const saveForLaterButton = getById('main-form-save-for-later') as HTMLAnchorElement;

if (submitCaseButton) {
  submitCaseButton.addEventListener('click', disableSubmitCaseButton);
}

export function disableSubmitCaseButton(): void {
  if (
    submitCaseButton &&
    !submitCaseButton.disabled &&
    window &&
    window.location &&
    window.location.href &&
    window.location.href.includes('check-your-answers')
  ) {
    saveForLaterButton.href = '#';
    saveForLaterButton.className = 'govuk-button govuk-button--disabled';
    saveForLaterButton.ariaDisabled = 'true';
    submitCaseButton.disabled = true;
    submitCaseButton.className = 'govuk-button govuk-button--disabled';
    submitCaseButton.ariaDisabled = 'true';
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lng');
    if (lang && lang === 'cy') {
      window.open(InterceptPaths.SUBMIT_CASE + '?lng=cy', '_self');
    } else {
      window.open(InterceptPaths.SUBMIT_CASE, '_self');
    }
  }
}
