import axios from 'axios';

import { createCase } from '../../../main/services/CaseService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Axios post to iniate case', () => {
  it('should make call to the api with axios with correct url and data', async () => {
    createCase('testCaseData', 'testToken', 'testurl');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'testurl/case-type/ET_EnglandWales/event-type/initiateCaseDraft/case',
      expect.objectContaining({
        case_source: '',
        case_type: 'testCaseData',
      }),
      expect.objectContaining({
        headers: { Authorization: 'Bearer testToken' },
      })
    );
  });
});
