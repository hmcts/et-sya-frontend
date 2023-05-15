const govUkFrontend = require('govuk-frontend');

const sessionTimeout = require('./session/utils');

import '../scss/main.scss';
import './go-back';

govUkFrontend.initAll();
import './print';
import './cookie';
import './set-focus';
import './submit-claim';
<<<<<<< HEAD

=======
>>>>>>> master
sessionTimeout.ready(sessionTimeout.initialize);
import './data-layer';
