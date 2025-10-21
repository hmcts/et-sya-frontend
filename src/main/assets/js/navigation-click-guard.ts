import { qsa } from './selectors';

const clickedLinks = new Set<HTMLAnchorElement>();

const navigationLinks = qsa('[data-navigation-link]') as NodeListOf<HTMLAnchorElement>;

navigationLinks.forEach((link: HTMLAnchorElement) => {
  link.addEventListener('click', (event: Event) => {
    const target = event.currentTarget as HTMLAnchorElement;
    // Block if already clicked
    if (clickedLinks.has(target)) {
      event.preventDefault();
      return;
    }
    // Mark as clicked
    clickedLinks.add(target);
  });
});

// Clear blocked links when the page is shown again
window.addEventListener('pageshow', () => {
  clickedLinks.clear();
});
