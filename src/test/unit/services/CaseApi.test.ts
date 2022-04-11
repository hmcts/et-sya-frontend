import axios from 'axios';
import config from 'config';

import { UserDetails } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { CcdDataModel } from '../../../main/definitions/constants';
import { State } from '../../../main/definitions/definition';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';

jest.mock('axios');
jest.mock('config');

const userDetails: UserDetails = {
  accessToken: '123',
  email: 'billy@bob.com',
  givenName: 'billy',
  familyName: 'bob',
  id: 'something',
};

describe('CaseApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  let api = new CaseApi(mockedAxios);
  beforeEach(() => {
    api = new CaseApi(mockedAxios);
  });

  test.each([CcdDataModel.SINGLE_CASE_ENGLAND])('Should return %s case data response', async () => {
    // add more example cases in this array to test other case data
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: '1234',
          state: State.Draft,
          case_data: {
            caseSource: 'Manually Created',
            caseType: 'Single',
          },
        },
      ],
    });

    const userCase = await api.getCase();

    expect(userCase).toStrictEqual({
      id: '1234',
      state: State.Draft,
      isASingleClaim: YesOrNo.YES,
    });
  });

  test('Should return the single case if one case is found', async () => {
    const mockCase = {
      id: '100',
      state: State.Draft,
      case_data: {
        caseSource: 'Manually Created',
        caseType: 'Single',
      },
    };

    mockedAxios.get.mockResolvedValue({
      data: [mockCase],
    });

    const userCase = await api.getCase();

    expect(userCase).toStrictEqual({
      id: '100',
      state: State.Draft,
      isASingleClaim: YesOrNo.YES,
    });
  });

  test('Should retrieve the last case if two cases found', async () => {
    const firstMockCase = {
      id: '1',
      state: State.Draft,
      case_data: {
        caseSource: 'Manually Created',
        caseType: 'Single',
      },
    };
    const secondMockCase = {
      id: '2',
      state: State.Draft,
      case_data: {
        caseSource: 'Manually Created',
        caseType: 'Single',
      },
    };

    mockedAxios.get.mockResolvedValue({
      data: [firstMockCase, secondMockCase],
    });

    const userCase = await api.getCase();

    expect(userCase).toStrictEqual({
      id: '2',
      state: State.Draft,
      isASingleClaim: YesOrNo.YES,
    });
  });

  test('Should return false if no cases are found', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [],
    });
    const userCase = await api.getCase();
    expect(userCase).toStrictEqual(false);
  });

  describe('getCaseApi', () => {
    beforeAll(() => {
      config.get('services.etSyaApi.host');
      return 'http://randomurl';
    });
    test('should create a CaseApi', () => {
      expect(getCaseApi(userDetails)).toBeInstanceOf(CaseApi);
    });
  });
});
