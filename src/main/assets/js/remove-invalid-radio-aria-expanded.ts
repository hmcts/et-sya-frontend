declare module 'govuk-frontend' {
  export class Radios {
    syncConditionalRevealWithInputState(input: Element): void;
  }
}

import { Radios } from 'govuk-frontend';

const patchedFlag = Symbol('preventInvalidRadioAriaExpanded');

type SyncConditionalReveal = (this: unknown, input: Element) => void;

type RadioPrototype = {
  syncConditionalRevealWithInputState: SyncConditionalReveal;
  [patchedFlag]?: true;
};

/**
 * govuk-frontend 6.6.0 sets aria-expanded on radios that reveal conditional content.
 * That attribute is not allowed on the radio role, so axe reports aria-allowed-attr
 * (WCAG 4.1.2). aria-controls and the conditional show/hide class stay in place.
 *
 * GOV.UK Frontend removes the attribute in https://github.com/alphagov/govuk-frontend/pull/7503,
 * which is not in a published release yet. Drop this patch when the installed version includes it.
 *
 * The attribute is applied again from the radios click handler and from pageshow, so stripping it
 * once after initAll() is not enough.
 */
export function preventInvalidRadioAriaExpanded(): void {
  const proto = Radios.prototype as RadioPrototype;
  if (proto[patchedFlag] || typeof proto.syncConditionalRevealWithInputState !== 'function') {
    return;
  }

  const original = proto.syncConditionalRevealWithInputState;
  proto.syncConditionalRevealWithInputState = function (input: Element): void {
    original.call(this, input);
    input.removeAttribute('aria-expanded');
  };
  proto[patchedFlag] = true;
}
