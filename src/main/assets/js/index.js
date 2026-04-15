document.body.classList.add('govuk-frontend-supported');
// Import the GOV.UK Frontend JavaScript
import { initAll } from 'govuk-frontend';

// Import other JavaScript modules or files
import '../scss/main.scss';
import './go-back';
import './print';
import './cookie';
import './set-focus';
// import './submit-claim';
import { initialize, ready } from './session/utils';
import './data-layer';
import './navigation-click-guard';
// Initialize GOV.UK Frontend components
initAll();

// govuk-frontend sets aria-expanded on conditional radio/checkbox inputs, which
// is not a valid ARIA attribute for the radio role (WCAG 4.1.2 / axe aria-allowed-attr).
// Remove it from all radio and checkbox inputs after initialisation.
document.querySelectorAll('input[type="radio"][aria-expanded], input[type="checkbox"][aria-expanded]').forEach(function (el) {
  el.removeAttribute('aria-expanded');
});

// Initialize other components or modules
ready(initialize);
