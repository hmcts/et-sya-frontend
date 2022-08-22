import { addAriaExpandedAttribute, addAriaExpandedEventListener } from './aria-utils';
//import CookiesBanner from './cookies-banner';
//import { addNationalityEventListener, addStatelessEventListener } from './nationality-utils';
import SessionTimeout from './session-timeout';

const govUK = require('govuk-frontend');

const ready = (callback: () => void) => {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

function initialize() {
  console.log('#######################################################');
  console.log('#####################################################');
  console.log('######  initialize callback executing ####################');
  console.log('#####################################################');
  console.log('#####################################################');
  // const cookies: CookiesBanner = new CookiesBanner();
  const sessionTimeout: SessionTimeout = new SessionTimeout();
  // cookies.init();
  govUK.initAll();
  sessionTimeout.init();
  addAriaExpandedAttribute();
  addAriaExpandedEventListener();
  // addStatelessEventListener();
  // addNationalityEventListener();
}

module.exports = { initialize, ready };
