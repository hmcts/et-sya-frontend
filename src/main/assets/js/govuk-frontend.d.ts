declare module 'govuk-frontend' {
  export class Radios {
    constructor($root: Element);
    syncConditionalRevealWithInputState(input: Element): void;
  }

  export class Checkboxes {
    constructor($root: Element);
  }
}
