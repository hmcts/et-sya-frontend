const patchedFlag = Symbol('preventInvalidRadioAriaExpanded');

type SyncConditionalReveal = (this: unknown, input: Element) => void;

type RadioPrototype = {
  syncConditionalRevealWithInputState?: SyncConditionalReveal;
  [patchedFlag]?: true;
};

export type ConditionalRadios = {
  prototype: RadioPrototype;
};

/**
 * govuk-frontend 6.6.0 sets aria-expanded on radios that reveal conditional content.
 * That attribute is not allowed on the radio role, so axe reports aria-allowed-attr
 * (WCAG 4.1.2). aria-controls and the conditional show/hide class stay in place.
 *
 * Pass the Radios class that initAll() constructs. This file is compiled to CommonJS, and
 * requiring govuk-frontend from here loads a second copy. Patching that copy leaves the
 * radios on the page unchanged.
 *
 * GOV.UK Frontend removes the attribute in https://github.com/alphagov/govuk-frontend/pull/7503,
 * which is not in a published release yet. Drop this patch when the installed version includes it.
 *
 * The attribute is applied again from the radios click handler and from pageshow, so stripping it
 * once after initAll() is not enough.
 */
export function preventInvalidRadioAriaExpanded(Radios: ConditionalRadios): void {
  const proto = Radios.prototype;
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
