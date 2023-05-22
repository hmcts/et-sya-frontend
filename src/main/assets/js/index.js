const sessionTimeout = require('./session/utils');

const govUkFrontend = require('govuk-frontend');

import '../scss/main.scss';
import './go-back';

govUkFrontend.initAll();
import './print';
import './cookie';
import './set-focus';
import './submit-claim';

sessionTimeout.ready(sessionTimeout.initialize);
import './data-layer';
