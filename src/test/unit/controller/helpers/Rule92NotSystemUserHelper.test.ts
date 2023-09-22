import {
  getLatestApplication,
  getStoredPendingApplicationLinks,
} from '../../../../main/controllers/helpers/Rule92NotSystemUserHelper';
import { GenericTseApplicationTypeItem } from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, languages } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';

describe('getStoredPendingApplicationLinks', () => {
  it('should return /stored-to-submit with application id', () => {
    const tseCollection: GenericTseApplicationTypeItem[] = [
      {
        id: '123',
        value: {
          number: '2345',
          status: 'Stored',
        },
      },
      {
        id: '345',
        value: {
          number: '4567',
          status: 'Open',
        },
      },
      {
        id: '567',
        value: {
          number: '6789',
          status: 'Stored',
        },
      },
    ];
    const expected: string[] = ['/stored-to-submit/123?lng=en', '/stored-to-submit/567?lng=en'];
    const actual = getStoredPendingApplicationLinks(tseCollection, languages.ENGLISH_URL_PARAMETER);
    expect(actual).toEqual(expected);
  });
});

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
