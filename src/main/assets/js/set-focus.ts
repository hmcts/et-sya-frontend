// Autofocus section
// Code below automatically focuses to errors, in case any error exists on the page for accessibility
{
  const govUKErrors = Array.from(
    document.getElementsByClassName('govuk-error-summary__title') as HTMLCollectionOf<HTMLElement>
  );
  if (govUKErrors !== null && govUKErrors !== undefined && govUKErrors.length > 0) {
    govUKErrors[0].focus();
  }
}
