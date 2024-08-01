import { CaseWithId } from '../../../main/definitions/case';
import { CaseState } from '../../../main/definitions/definition';
import { currentStateFn } from '../../../main/helper/state-sequence';
import { mockHearingCollection } from '../mocks/mockHearing';

describe('currentStateFn', () => {
  it('should return StateSequence for submitted case', () => {
    const userCase: Partial<CaseWithId> = {};
    const stateSequence = currentStateFn(userCase);
    expect(stateSequence.stateIndex).toBe(0); // Ensure it starts at SUBMITTED
  });

  it('should return StateSequence for accepted case', () => {
    const userCase: Partial<CaseWithId> = {
      state: CaseState.ACCEPTED,
      hearingCollection: [],
      et3ResponseReceived: false,
    };
    const stateSequence = currentStateFn(userCase);
    expect(stateSequence.stateIndex).toBe(1); // Ensure it starts at ACCEPTED
  });

  it('should return StateSequence for response received case', () => {
    const userCase: Partial<CaseWithId> = {
      hearingCollection: [],
      et3ResponseReceived: true,
    };
    const stateSequence = currentStateFn(userCase);
    expect(stateSequence.stateIndex).toBe(2); // Ensure it starts at RESPONSE_RECEIVED
  });

  it('should return StateSequence for hearing details case', () => {
    const userCase: Partial<CaseWithId> = {
      hearingCollection: mockHearingCollection,
    };
    const stateSequence = currentStateFn(userCase);
    expect(stateSequence.stateIndex).toBe(3); // Ensure it starts at HEARING_DETAILS
  });
});
