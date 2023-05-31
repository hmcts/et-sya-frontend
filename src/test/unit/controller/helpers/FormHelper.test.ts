import { createLabelForHearing, createRadioBtnsForHearings } from '../../../../main/controllers/helpers/FormHelpers';
import { mockHearingCollection } from '../../mocks/mockHearing';

describe('createRadioBtnsForHearings - create radio buttons for selecting a hearing', () => {
  it('should return a label, name and value for each hearing', () => {
    const radioButtons = createRadioBtnsForHearings(mockHearingCollection);
    expect(radioButtons[0]).toEqual(
      expect.objectContaining({
        label: expect.any(String),
        name: 'hearingDocumentsAreFor',
        value: mockHearingCollection[0].id,
      })
    );
  });

  it('should return undefined if no hearings are present for future dates', () => {
    mockHearingCollection[0].value.hearingDateCollection[0].value.listedDate = new Date('2022-07-04T14:00:00.000');
    const radioButtons = createRadioBtnsForHearings(mockHearingCollection);
    expect(radioButtons).toEqual(undefined);
  });
});

describe('createLabelForHearing - produce a formatted label with hearing venue and date', () => {
  it('should return a label, with hearing type, location and formatted date', () => {
    const label = createLabelForHearing(mockHearingCollection[0]);
    mockHearingCollection[0].value.hearingDateCollection[0].value.listedDate = new Date('2024-07-04T14:00:00.000');

    expect(label).toEqual('Hearing - RCJ - 4 Jul 2024');
  });

  it('should return undefined if no hearings are present for future dates', () => {
    mockHearingCollection[0].value.hearingDateCollection[0].value.listedDate = new Date('2022-07-04T14:00:00.000');
    const radioButtons = createRadioBtnsForHearings(mockHearingCollection);
    expect(radioButtons).toEqual(undefined);
  });
});
