import { getLatestApplication } from '../../../../main/controllers/helpers/StoredApplicationConfirmationHelpers';
import { GenericTseApplicationTypeItem } from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';

describe('getLatestApplication', () => {
  const req = mockRequest({});
  const claimantItem1: GenericTseApplicationTypeItem = {
    id: '123',
    value: {
      applicant: Applicant.CLAIMANT,
      number: '2345',
      status: 'Stored',
    },
  };
  req.session.userCase.genericTseApplicationCollection = [claimantItem1];
  const respondentItem1: GenericTseApplicationTypeItem = {
    id: '345',
    value: {
      applicant: Applicant.RESPONDENT,
      number: '4567',
      status: 'Stored',
    },
  };
  req.session.userCase.genericTseApplicationCollection.push(respondentItem1);

  it('should return last application 123', async () => {
    const expected = claimantItem1;
    const actual = await getLatestApplication(req.session.userCase.genericTseApplicationCollection);
    expect(actual).toEqual(expected);
  });

  it('should return last application 345', async () => {
    const claimantItem2: GenericTseApplicationTypeItem = {
      id: '567',
      value: {
        applicant: Applicant.CLAIMANT,
        number: '6789',
        status: 'Open',
      },
    };
    req.session.userCase.genericTseApplicationCollection.push(claimantItem2);

    const expected = claimantItem2;
    const actual = await getLatestApplication(req.session.userCase.genericTseApplicationCollection);
    expect(actual).toEqual(expected);
  });
});
