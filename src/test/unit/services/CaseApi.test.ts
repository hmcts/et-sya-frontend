import axios from 'axios';

import { YesOrNo } from '../../../main/definitions/case';
import { CcdDataModel } from '../../../main/definitions/constants';
import { State } from '../../../main/definitions/definition';
import { CaseApi } from '../../../main/services/CaseService';

jest.mock('axios');

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
});
