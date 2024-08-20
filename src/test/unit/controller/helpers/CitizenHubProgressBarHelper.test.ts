import { getProgressBarItems } from '../../../../main/controllers/helpers/CitizenHubProgressBarHelper';
import { CaseWithId } from '../../../../main/definitions/case';
import { CaseState } from '../../../../main/definitions/definition';
import { ProgressBarItem } from '../../../../main/definitions/govuk/hmctsProgressBar';
import { mockHearingCollection } from '../../mocks/mockHearing';

describe('getProgressBarItems', () => {
  const translations = {
    accepted: 'Claim accepted',
    received: 'Response received',
    details: 'Your hearing details',
    decision: 'Your claim decision',
  };

  it('should return the correct progress bar items when the case is in the ACCEPTED state', () => {
    const userCase: Partial<CaseWithId> = {
      state: CaseState.ACCEPTED,
      et3ResponseReceived: false,
      hearingCollection: [],
    };

    const result = getProgressBarItems(userCase, translations);

    const expected: ProgressBarItem[] = [
      {
        label: { text: 'Claim accepted' },
        complete: true,
        active: true,
      },
      {
        label: { text: 'Response received' },
        complete: false,
        active: false,
      },
      {
        label: { text: 'Your hearing details' },
        complete: false,
        active: false,
      },
      {
        label: { text: 'Your claim decision' },
        complete: false,
        active: false,
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should return the correct progress bar items when ET3 response received but no hearing', () => {
    const userCase: Partial<CaseWithId> = {
      state: CaseState.ACCEPTED,
      et3ResponseReceived: true,
      hearingCollection: [],
    };

    const result = getProgressBarItems(userCase, translations);

    const expected: ProgressBarItem[] = [
      {
        label: { text: 'Claim accepted' },
        complete: true,
        active: false,
      },
      {
        label: { text: 'Response received' },
        complete: true,
        active: true,
      },
      {
        label: { text: 'Your hearing details' },
        complete: false,
        active: false,
      },
      {
        label: { text: 'Your claim decision' },
        complete: false,
        active: false,
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should return the correct progress bar items when both ET3 response received and hearing exists', () => {
    const userCase: Partial<CaseWithId> = {
      state: CaseState.ACCEPTED,
      et3ResponseReceived: true,
      hearingCollection: mockHearingCollection,
    };

    const result = getProgressBarItems(userCase, translations);

    const expected: ProgressBarItem[] = [
      {
        label: { text: 'Claim accepted' },
        complete: true,
        active: false,
      },
      {
        label: { text: 'Response received' },
        complete: true,
        active: false,
      },
      {
        label: { text: 'Your hearing details' },
        complete: true,
        active: true,
      },
      {
        label: { text: 'Your claim decision' },
        complete: false,
        active: false,
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should return the correct progress bar items when hearing exists but ET3 response is not received', () => {
    const userCase: Partial<CaseWithId> = {
      state: CaseState.ACCEPTED,
      et3ResponseReceived: false,
      hearingCollection: mockHearingCollection,
    };

    const result = getProgressBarItems(userCase, translations);

    const expected: ProgressBarItem[] = [
      {
        label: { text: 'Claim accepted' },
        complete: true,
        active: false,
      },
      {
        label: { text: 'Response received' },
        complete: false,
        active: false,
      },
      {
        label: { text: 'Your hearing details' },
        complete: true,
        active: true,
      },
      {
        label: { text: 'Your claim decision' },
        complete: false,
        active: false,
      },
    ];

    expect(result).toEqual(expected);
  });
});
