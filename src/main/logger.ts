import { LoggerInstance } from 'winston';
export { LoggerInstance as Logger } from 'winston';

const { Logger } = require('@hmcts/nodejs-logging');

// Adapter for external logger and converts import to ES6 from CommonJS
export const getLogger = (name: string): LoggerInstance => {
  return Logger.getLogger(name);
};
