import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';

/**
 * Type definition for a check function that determines if a redirect should occur.
 * @param {AppRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {boolean} True if redirect occurred, false if access is allowed
 */
export type CheckFunction = (req: AppRequest, res: Response) => boolean;

/**
 * A base decorator factory that wraps a method to perform a check and redirect if necessary.
 * If the provided check function determines a redirect is needed, the original method will not be executed.
 * Otherwise, the original method is invoked with the provided arguments.
 *
 * @param {CheckFunction} checkFunction - The function to check if a redirect should occur
 * @returns A decorator function that can be applied to methods or properties
 */
export function createCheckDecorator(checkFunction: CheckFunction) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor): any => {
    /**
     * Wraps the original method to include checking and redirection logic.
     *
     * @param {Function} method - The original method to be wrapped.
     * @returns {Function} A new function that includes the checking logic.
     */
    const wrapMethod = (method: any) => {
      return function (req: AppRequest, res: Response, ...args: any[]): void | Promise<void> {
        if (checkFunction(req, res)) {
          return; // Redirect occurred, do not execute the original method.
        }
        return method.apply(this, [req, res, ...args]); // Execute the original method.
      };
    };

    // If a descriptor is provided, wrap the method directly.
    if (descriptor) {
      descriptor.value = wrapMethod(descriptor.value);
      return descriptor;
    }

    // Handle cases where no descriptor is provided (e.g., property decorators).
    const originalDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {
      writable: true,
      enumerable: true,
      configurable: true,
    };

    let originalMethod: any;

    // Define a getter and setter to wrap the method dynamically.
    Object.defineProperty(target, propertyKey, {
      get: () => wrapMethod(originalMethod),
      set: (newValue: any) => {
        originalMethod = newValue;
      },
      enumerable: originalDescriptor.enumerable,
      configurable: originalDescriptor.configurable,
    });
  };
}
