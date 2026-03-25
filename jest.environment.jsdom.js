/**
 * Custom Jest environment that patches jsdom's VirtualConsole for compatibility
 * between jest-environment-jsdom@29 (which calls sendTo) and jsdom@25+
 * (which renamed sendTo to forwardTo).
 */
const { VirtualConsole } = require('jsdom');

if (!VirtualConsole.prototype.sendTo && typeof VirtualConsole.prototype.forwardTo === 'function') {
  VirtualConsole.prototype.sendTo = VirtualConsole.prototype.forwardTo;
}

module.exports = require('jest-environment-jsdom');
