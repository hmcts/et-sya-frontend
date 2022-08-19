import { CaseWithId, YesOrNo } from '../definitions/case';
import { CaseState, HubCaseState } from '../definitions/definition';

export class StateSequence {
  states: string[];
  stateIndex: number;

  constructor(readonly stateList: string[]) {
    this.states = stateList;
    this.stateIndex = 0;
  }

  public at(currentState: string): StateSequence {
    this.stateIndex = this.states.indexOf(currentState);
    return this;
  }

  public isAfter(state: string): boolean {
    return this.stateIndex > this.states.indexOf(state);
  }

  public isAtOrAfter(state: string): boolean {
    return this.stateIndex >= this.states.indexOf(state);
  }

  public isBefore(state: string): boolean {
    return this.stateIndex < this.states.indexOf(state);
  }

  public toHubState(userCase: Partial<CaseWithId>): HubCaseState {
    if (userCase.et3IsThereAnEt3Response === YesOrNo.YES) {
      return HubCaseState.RESPONSE_RECEIVED;
    } else if (userCase.state === CaseState.ACCEPTED) {
      return HubCaseState.ACCEPTED;
    }
    return HubCaseState.SUBMITTED;
  }
}

export const currentStateFn = (userCase: Partial<CaseWithId>): StateSequence => {
  const stateSequence = new StateSequence([
    HubCaseState.SUBMITTED,
    HubCaseState.ACCEPTED,
    HubCaseState.RESPONSE_RECEIVED,
    HubCaseState.HEARING_DETAILS,
    HubCaseState.CLAIM_DECISION,
  ]);

  const currentHubState = stateSequence.toHubState(userCase);

  return stateSequence.at(currentHubState as HubCaseState);
};
