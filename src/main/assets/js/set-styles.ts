const govUKHeaders = Array.from(document.getElementsByClassName('govuk-heading-xl') as HTMLCollectionOf<HTMLElement>);
if (govUKHeaders !== undefined && govUKHeaders !== null && govUKHeaders.length > 0) {
  govUKHeaders.forEach(govUKHeader => {
    govUKHeader.style.hyphens = 'auto';
  });
}
