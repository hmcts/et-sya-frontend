// Autofocus section
// Code below automatically focuses to errors, in case any error exists on the page for accessibility
/*{
  const govUKErrors = Array.from(
    document.getElementsByClassName('govuk-error-summary__title') as HTMLCollectionOf<HTMLElement>
  );

  if (govUKErrors !== null && govUKErrors !== undefined && govUKErrors.length > 0) {
    if (!isHidden(govUKErrors[0])) {
      const govUKErrorsSkipLinkArray = Array.from(
        document.getElementsByClassName('govuk-skip-link') as HTMLCollectionOf<HTMLElement>
      );
      if (
        govUKErrorsSkipLinkArray !== null &&
        govUKErrorsSkipLinkArray !== undefined &&
        govUKErrorsSkipLinkArray.length > 0
      ) {
        govUKErrorsSkipLinkArray[0].classList.add('hidden');
      }
      document.title = 'Error: ' + document.title;
      govUKErrors[0].focus();
    }
  }

}*/

if (document.addEventListener) {
  document.addEventListener('load', onElementFocused, true);
  document.addEventListener('DOMContentLoaded', onElementFocused, true);
}

function onElementFocused() {
  if (document.hasFocus()) {
    const govUKErrors = Array.from(
      document.getElementsByClassName('govuk-error-summary__title') as HTMLCollectionOf<HTMLElement>
    );

    if (govUKErrors !== null && govUKErrors !== undefined && govUKErrors.length > 0) {
      if (!isHidden(govUKErrors[0])) {
        const govUKErrorsSkipLinkArray = Array.from(
          document.getElementsByClassName('govuk-skip-link') as HTMLCollectionOf<HTMLElement>
        );
        if (
          govUKErrorsSkipLinkArray !== null &&
          govUKErrorsSkipLinkArray !== undefined &&
          govUKErrorsSkipLinkArray.length > 0
        ) {
          govUKErrorsSkipLinkArray[0].classList.add('hidden');
        }
        document.title = 'Error: ' + document.title;
        govUKErrors[0].focus();
      }
    }
  }
}

function isHidden(el: HTMLElement): boolean {
  const govUKErrorsDivHidden = Array.from(
    document.getElementsByClassName('govuk-error-summary hidden') as HTMLCollectionOf<HTMLElement>
  );
  if (govUKErrorsDivHidden !== null && govUKErrorsDivHidden !== undefined && govUKErrorsDivHidden.length > 0) {
    return true;
  } else {
    const style = window.getComputedStyle(el);
    return style.display === 'none';
  }
}
