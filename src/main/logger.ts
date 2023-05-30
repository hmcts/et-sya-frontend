const { Logger } = require('@hmcts/nodejs-logging');

export { Logger };

export const getLogger = (name: string): typeof Logger => {
  return Logger.getLogger(name);
};
