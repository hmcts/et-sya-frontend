// Autofocus section
// Code below automatically focuses to errors, in case any error exists on the page for accessibility

function focusToErrorSummary() {
  if (!govUKErrorSummary.classList.contains('hidden')) {
    const govUKErrorsSkipLink = findFirstElementByClassName('govuk-skip-link');
    if (govUKErrorsSkipLink !== null) {
      govUKErrorsSkipLink.classList.add('hidden');
    }
    if (!document.title.includes('Error')) {
      document.title = 'Error: ' + document.title;
    }
    govUKErrorSummary.focus();
    govUKErrorSummary.setAttribute('tabindex', '-1');
  }
}

if (document.addEventListener) {
  document.addEventListener('load', focusToErrorSummary);
  document.addEventListener('pageshow', focusToErrorSummary);
  document.addEventListener('DOMContentLoaded', focusToErrorSummary, true);
}

export const findFirstElementByClassName = (className: string): HTMLElement => {
  const elementsByClassName = Array.from(document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>);
  if (elementsByClassName !== null && elementsByClassName !== undefined && elementsByClassName.length > 0) {
    return elementsByClassName[0];
  }
  return null;
};
const govUKErrorSummary = findFirstElementByClassName('govuk-error-summary');

{
  focusToErrorSummary();
}
