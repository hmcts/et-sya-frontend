document.body.classList.add('govuk-frontend-supported');
// Import the GOV.UK Frontend JavaScript
import { initAll } from 'govuk-frontend';
// Import GOV.UK step-by-step navigation
import '@govuk-prototype-kit/step-by-step/javascripts/step-by-step-navigation.js';

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

// Initialize step-by-step navigation.
// Only call .init() when there are collapsible (.js-step) steps — the plugin
// adds a "Show all steps" button and expects at least one .js-panel to exist.
// When every step is pinned open (no .js-step elements), just unhide the container.
const $stepByStep = document.querySelector('#step-by-step-navigation');
if ($stepByStep) {
  if ($stepByStep.querySelectorAll('.js-step').length > 0) {
    new window.GOVUK.Modules.AppStepNav($stepByStep).init();
  } else {
    $stepByStep.classList.remove('js-hidden');
  }
}

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
