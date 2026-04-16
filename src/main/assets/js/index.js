document.body.classList.add('govuk-frontend-supported');
// Import the GOV.UK Frontend JavaScript
import { initAll } from 'govuk-frontend';

// Import other JavaScript modules or files
import '../scss/main.scss';
import './go-back';
import './print';
import './cookie';
import './set-focus';
import { initialize, ready } from './session/utils';
import './data-layer';
import './navigation-click-guard';
// Initialize GOV.UK Frontend components
initAll();

// govuk-frontend sets aria-expanded on conditional radio/checkbox inputs via initAll() and
// also re-adds it in a pageshow listener, but aria-expanded is not a valid attribute for the
// radio role (WCAG 4.1.2 / axe aria-allowed-attr). Register our cleanup AFTER initAll() so
// our pageshow listener fires after govuk-frontend's, overwriting what it re-adds.
const removeInvalidAriaExpanded = function () {
  document
    .querySelectorAll('input[type="radio"][aria-expanded], input[type="checkbox"][aria-expanded]')
    .forEach(function (el) {
      el.removeAttribute('aria-expanded');
    });
};
removeInvalidAriaExpanded();
window.addEventListener('pageshow', removeInvalidAriaExpanded);

// Initialize other components or modules
ready(initialize);
