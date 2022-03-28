/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';

import { DEVELOPMENT, HTTP } from './constants';
import { ENVIRONMENT, PROTOCOL } from './references';

/**
 * Allows us to integrate the Azure key-vault flex volume, so that we are able to access Node configuration values.
 */
propertiesVolume.addTo(config);

/**
 * Get Environment
 *
 * See Readme for more information on how the configuration file is set.
 * 'Environmental Variables Setup & Error Handling'
 *
 * @see Readme
 * @returns {string} ie. - development / preview / aat / ithc, prod
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export const getEnvironment = (): string => process.env.NODE_CONFIG_ENV;

/**
 * Get Configuration Value
 *
 * Returns the configuration value, using a config reference. It uses the reference to pull out the value
 * from the .yaml file
 *
 * @see /config .yaml
 * @see references.ts
 * @param reference - ie. 'services.ccdDefApi'
 */
export const getConfigValue = (reference: string) => config.get(reference);

/**
 * Generate Environment Check Text
 *
 * We generate text to be used for debugging purposes, so as the person attempting to initialise the application knows
 * what the NODE_CONFIG_ENV is set as and what config file is being used.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const environmentCheckText = () =>
  `NODE_CONFIG_ENV is set as ${process.env.NODE_CONFIG_ENV} therefore we are using the ${config.get(
    ENVIRONMENT
  )} config.`;

/**
 * Get Protocol
 *
 * If running locally we return 'http'
 *
 * @returns {string | string}
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getProtocol = () => (getEnvironment() === DEVELOPMENT ? HTTP : getConfigValue(PROTOCOL));
