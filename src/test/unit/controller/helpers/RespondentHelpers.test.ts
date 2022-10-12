import { setUserCaseForRespondent } from '../../../../main/controllers/helpers/RespondentHelpers';
import { mockSession } from '../../mocks/mockApp';
import { mockForm, mockFormField, mockValidationCheckWithOutError } from '../../mocks/mockForm';
import { mockRequest } from '../../mocks/mockRequest';
import { userCaseWith4Respondents } from '../../mocks/mockUserCaseWithRespondent';

describe('setUserCaseForRespondent', () => {
  it('should add new respondent to request when number of respondents is less than selectedRespondentIndex', () => {
    const req = mockRequest({
      session: mockSession([], [], []),
      body: { saveForLater: true, testFormField: 'test value' },
    });
    req.session.userCase = userCaseWith4Respondents;
    const formField = mockFormField(
      'testFormField',
      'test name',
      'text',
      'test value',
      mockValidationCheckWithOutError(),
      'test label'
    );
    req.params = { respondentNumber: '5' };
    const form = mockForm({ testFormField: formField });
    setUserCaseForRespondent(req, form);
    expect(req.session.userCase.respondents).toHaveLength(5);
  });
});
