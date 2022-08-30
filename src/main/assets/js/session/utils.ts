import { addAriaExpandedAttribute, addAriaExpandedEventListener } from './aria-utils';
import SessionTimeout from './session-timeout';

const ready = (callback: () => void) => {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

function initialize() {
  const sessionTimeout: SessionTimeout = new SessionTimeout();
  sessionTimeout.init();
  addAriaExpandedAttribute();
  addAriaExpandedEventListener();
}

module.exports = { initialize, ready };
