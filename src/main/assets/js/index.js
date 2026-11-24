document.body.classList.add('govuk-frontend-supported');
// Import the GOV.UK Frontend JavaScript
import { initAll } from 'govuk-frontend';

// Import other JavaScript modules or files
import '../scss/main.scss';
import './go-back';
import './print';
import './cookie';
import './set-focus';
import { preventInvalidRadioAriaExpanded } from './remove-invalid-radio-aria-expanded';
import { initialize, ready } from './session/utils';
import './data-layer';
import './navigation-click-guard';
// Patch before initAll() so the radios click and pageshow handlers cannot leave aria-expanded
// on an input. Checkboxes may still use aria-expanded; ARIA allows it on that role.
preventInvalidRadioAriaExpanded();
initAll();

// Initialize other components or modules
ready(initialize);
