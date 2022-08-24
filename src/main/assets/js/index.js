const govUkFrontend = require('govuk-frontend');

const sessionTimeout = require('./session/utils');

import '../scss/main.scss';
import './go-back';

govUkFrontend.initAll();
import './enter-address';
import './print';
import './set-focus';

sessionTimeout.ready(sessionTimeout.initialize);
