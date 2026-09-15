import { getProgressBarItems } from '../../../../main/controllers/helpers/CitizenHubProgressBarHelper';
import { CaseWithId } from '../../../../main/definitions/case';
import { CaseState } from '../../../../main/definitions/definition';
import { ProgressBarItem } from '../../../../main/definitions/govuk/hmctsProgressBar';
import { mockHearingCollection } from '../../mocks/mockHearing';

describe('getProgressBarItems', () => {
  const translations = {
    accepted: 'Claim accepted',
    received: 'Response received',
    responseDue: 'Response due',
    details: 'Your hearing details',
    decision: 'Your claim decision',
  };

  // A spot is green when complete, and shown in bold when active
  const stages = (items: ProgressBarItem[]): Record<string, string>[] =>
    items.map(item => ({
      label: item.label.text,
      dot: item.complete ? 'green' : 'empty',
      text: item.active ? 'bold' : 'standard',
    }));

  it('should mark the claim accepted stage as the current one once the claim is accepted', () => {
    const userCase: Partial<CaseWithId> = {
      state: CaseState.ACCEPTED,
      et3ResponseReceived: false,
      et3DueDate: '2022-08-19',
      hearingCollection: [],
    };

    expect(stages(getProgressBarItems(userCase, translations, '?lng=en'))).toEqual([
      { label: 'Claim accepted', dot: 'green', text: 'bold' },
      { label: 'Response due 19 August 2022', dot: 'empty', text: 'standard' },
      { label: 'Your hearing details', dot: 'empty', text: 'standard' },
      { label: 'Your claim decision', dot: 'empty', text: 'standard' },
    ]);
  });

  it('should move the current stage on to the response once it is received, leaving earlier stages green', () => {
    const userCase: Partial<CaseWithId> = {
      state: CaseState.ACCEPTED,
      et3ResponseReceived: true,
      hearingCollection: [],
    };

    expect(stages(getProgressBarItems(userCase, translations, '?lng=en'))).toEqual([
      { label: 'Claim accepted', dot: 'green', text: 'standard' },
      { label: 'Response received', dot: 'green', text: 'bold' },
      { label: 'Your hearing details', dot: 'empty', text: 'standard' },
      { label: 'Your claim decision', dot: 'empty', text: 'standard' },
    ]);
  });

  it('should leave the response spot empty when the case is listed before the response is received', () => {
    const userCase: Partial<CaseWithId> = {
      state: CaseState.ACCEPTED,
      et3ResponseReceived: false,
      hearingCollection: mockHearingCollection,
    };

    expect(stages(getProgressBarItems(userCase, translations, '?lng=en'))).toEqual([
      { label: 'Claim accepted', dot: 'green', text: 'standard' },
      { label: 'Response due', dot: 'empty', text: 'standard' },
      { label: 'Your hearing details', dot: 'green', text: 'bold' },
      { label: 'Your claim decision', dot: 'empty', text: 'standard' },
    ]);
  });

  it('should fill in the response spot when the response is accepted after listing, keeping the hearing current', () => {
    const userCase: Partial<CaseWithId> = {
      state: CaseState.ACCEPTED,
      et3ResponseReceived: true,
      hearingCollection: mockHearingCollection,
    };

    expect(stages(getProgressBarItems(userCase, translations, '?lng=en'))).toEqual([
      { label: 'Claim accepted', dot: 'green', text: 'standard' },
      { label: 'Response received', dot: 'green', text: 'standard' },
      { label: 'Your hearing details', dot: 'green', text: 'bold' },
      { label: 'Your claim decision', dot: 'empty', text: 'standard' },
    ]);
  });

  it('should mark the first stage as the current one before the claim is accepted', () => {
    const userCase: Partial<CaseWithId> = {
      state: CaseState.SUBMITTED,
      et3ResponseReceived: false,
      hearingCollection: [],
    };

    expect(stages(getProgressBarItems(userCase, translations, '?lng=en'))).toEqual([
      { label: 'Claim accepted', dot: 'empty', text: 'bold' },
      { label: 'Response due', dot: 'empty', text: 'standard' },
      { label: 'Your hearing details', dot: 'empty', text: 'standard' },
      { label: 'Your claim decision', dot: 'empty', text: 'standard' },
    ]);
  });

  it('should mark exactly one stage as the current one', () => {
    const userCase: Partial<CaseWithId> = {
      state: CaseState.ACCEPTED,
      et3ResponseReceived: true,
      hearingCollection: mockHearingCollection,
    };

    const result = getProgressBarItems(userCase, translations, '?lng=en');

    expect(result.filter(item => item.active)).toHaveLength(1);
  });
});
