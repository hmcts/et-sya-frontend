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
import './button-navigation';
// Initialize GOV.UK Frontend components
initAll();

// Initialize other components or modules
ready(initialize);
