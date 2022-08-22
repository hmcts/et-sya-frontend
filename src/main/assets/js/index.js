const govUkFrontend = require('govuk-frontend');

const sessionJs = require('./session/utils');
console.log('browser javascript');
import './session/utils';

import '../scss/main.scss';
import './go-back';

govUkFrontend.initAll();
import './enter-address';
import './print';
import './set-focus';

sessionJs.ready(sessionJs.initialize);
