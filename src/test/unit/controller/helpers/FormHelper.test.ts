import { createLabelForHearing, createRadioBtnsForHearings } from '../../../../main/controllers/helpers/FormHelpers';
import { mockHearingCollection } from '../../mocks/mockHearing';

describe('createRadioBtnsForHearings - create radio buttons for selecting a hearing', () => {
  it('should return a label, name and value for each hearing', () => {
    const collection = [...mockHearingCollection];
    const radioButtons = createRadioBtnsForHearings(collection);
    expect(radioButtons[0]).toEqual(
      expect.objectContaining({
        label: expect.any(String),
        name: 'hearingDocumentsAreFor',
        value: mockHearingCollection[0].id,
      })
    );
  });

  it('should return undefined if no hearings are present for future dates', () => {
    const collection = [...mockHearingCollection];
    collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2022-07-04T14:00:00.000');
    const radioButtons = createRadioBtnsForHearings(collection);
    expect(radioButtons).toEqual(undefined);
  });
});

describe('createLabelForHearing - produce a formatted label with hearing venue and date', () => {
  it('should return a label, with hearing number, hearing type, location and formatted date', () => {
    const collection = [...mockHearingCollection];
    collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
    const label = createLabelForHearing(collection[0]);

    expect(label).toEqual('3333 Hearing - RCJ - 4 July 2038');
  });
  it('should not return the hearing number if undefined', () => {
    const collection = [...mockHearingCollection];
    collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
    collection[0].value.hearingNumber = undefined;
    const label = createLabelForHearing(collection[0]);
    expect(label).toEqual(' Hearing - RCJ - 4 July 2038');
  });
  it('should not return the hearing venue if undefined', () => {
    const collection = [...mockHearingCollection];
    collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
    collection[0].value.Hearing_venue = undefined;
    const label = createLabelForHearing(collection[0]);
    expect(label).toEqual('3333 Hearing -  - 4 July 2038');
  });
  it('should return the earliest date in the furture from the hearing collection', () => {
    const collection = [...mockHearingCollection];
    collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2040-07-04T14:00:00.000');
    collection[0].value.hearingDateCollection[1].value.listedDate = new Date('2042-07-04T14:00:00.000');
    const label = createLabelForHearing(collection[0]);
    expect(label).toEqual('3333 Hearing - RCJ - 4 July 2040');
  });
});
