import AccessibilityStatementController from '../../../main/controllers/AccessibilityStatementController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const accessibilityStatementController = new AccessibilityStatementController();

describe('Accessibility statement controller', () => {
  const t = {
    'accessibility-statement': {},
  };

  it('should render the accessibility statement page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    accessibilityStatementController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.ACCESSIBILITY_STATEMENT, expect.anything());
  });
});
