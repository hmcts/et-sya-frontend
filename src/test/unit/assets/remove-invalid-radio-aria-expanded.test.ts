/**
 * @jest-environment <rootDir>/jest.environment.jsdom.js
 */
import { Checkboxes, Radios } from 'govuk-frontend';

import { preventInvalidRadioAriaExpanded } from '../../../main/assets/js/remove-invalid-radio-aria-expanded';

const radiosMarkup = `
  <form>
    <div class="govuk-radios" data-module="govuk-radios">
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="pension" name="claimantPensionContribution" type="radio" value="Yes" data-aria-controls="conditional-pension" checked>
        <label class="govuk-label govuk-radios__label" for="pension">Yes</label>
      </div>
      <div class="govuk-radios__conditional" id="conditional-pension">Pension details</div>
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="pension-2" name="claimantPensionContribution" type="radio" value="No">
        <label class="govuk-label govuk-radios__label" for="pension-2">No</label>
      </div>
    </div>
  </form>
`;

const checkboxMarkup = `
  <div class="govuk-checkboxes" data-module="govuk-checkboxes">
    <input class="govuk-checkboxes__input" id="benefit" name="benefit" type="checkbox" value="Yes" data-aria-controls="conditional-benefit">
    <div class="govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden" id="conditional-benefit">Details</div>
  </div>
`;

describe('preventInvalidRadioAriaExpanded', () => {
  beforeEach(() => {
    document.body.classList.add('govuk-frontend-supported');
    document.body.innerHTML = radiosMarkup;
    preventInvalidRadioAriaExpanded(Radios);
    const radios = document.querySelector('.govuk-radios');
    if (!radios) {
      throw new Error('radios root missing');
    }
    new Radios(radios);
  });

  it('does not leave aria-expanded on a conditional radio after initialisation', () => {
    const yes = document.getElementById('pension');
    const conditional = document.getElementById('conditional-pension');

    expect(yes?.getAttribute('aria-expanded')).toBeNull();
    expect(yes?.getAttribute('aria-controls')).toBe('conditional-pension');
    expect(yes?.hasAttribute('data-aria-controls')).toBe(false);
    expect(conditional?.classList.contains('govuk-radios__conditional--hidden')).toBe(false);
  });

  it('keeps aria-expanded off when another radio is chosen and hides the reveal', () => {
    const yes = document.getElementById('pension');
    const no = document.getElementById('pension-2');
    const conditional = document.getElementById('conditional-pension');
    if (!(no instanceof HTMLInputElement)) {
      throw new Error('radio missing');
    }

    no.click();

    expect(no.checked).toBe(true);
    expect(yes?.getAttribute('aria-expanded')).toBeNull();
    expect(no?.getAttribute('aria-expanded')).toBeNull();
    expect(yes?.getAttribute('aria-controls')).toBe('conditional-pension');
    expect(conditional?.classList.contains('govuk-radios__conditional--hidden')).toBe(true);
  });

  it('keeps aria-expanded off when the page is restored from the back-forward cache', () => {
    const yes = document.getElementById('pension');

    window.dispatchEvent(new Event('pageshow'));

    expect(yes?.getAttribute('aria-expanded')).toBeNull();
    expect(yes?.getAttribute('aria-controls')).toBe('conditional-pension');
    expect(
      document.getElementById('conditional-pension')?.classList.contains('govuk-radios__conditional--hidden')
    ).toBe(false);
  });

  it('still sets aria-expanded on conditional checkboxes', () => {
    document.body.innerHTML = checkboxMarkup;
    const checkboxes = document.querySelector('.govuk-checkboxes');
    if (!checkboxes) {
      throw new Error('checkboxes root missing');
    }
    new Checkboxes(checkboxes);

    expect(document.getElementById('benefit')?.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById('benefit')?.getAttribute('aria-controls')).toBe('conditional-benefit');
  });
});
