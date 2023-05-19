const { Logger } = require('@hmcts/nodejs-logging');

export { Logger };

export const getLogger = (name: string) => {
  return Logger.getLogger(name);
};
