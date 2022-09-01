const govUkFrontend = require('govuk-frontend');

const sessionTimeout = require('./session/utils');

import '../scss/main.scss';
import './go-back';

govUkFrontend.initAll();
import './enter-address';
import './print';
import './cookie';
import './set-focus';

sessionTimeout.ready(sessionTimeout.initialize);
import './data-layer';
