import ClaimJurisdictionSelectionController from '../../../main/controllers/ClaimJurisdictionSelectionController';
import { returnValidUrl } from '../../../main/controllers/helpers/RouterHelpers';
import { CaseTypeId } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claim Jurisdiction Selection Controller', () => {
  const t = {
    'claim-jurisdiction-selection': {},
    common: {},
  };

  it('should render the Claim Jurisdiction Selection page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    new ClaimJurisdictionSelectionController().get(request, response);

    expect(response.render).toHaveBeenCalledWith('claim-jurisdiction-selection', expect.anything());
  });

  describe('post()', () => {
    it("should return a 'required' error when the claimJurisdiction field is empty", () => {
      const body = {
        claimJurisdiction: '',
      };
      const errors = [{ propertyName: 'claimJurisdiction', errorType: 'required' }];

      const req = mockRequest({ body });
      const res = mockResponse();
      new ClaimJurisdictionSelectionController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(returnValidUrl(req.path, Object.values(PageUrls)));
      expect(req.session.errors).toEqual(errors);
    });

    it('should render the next page when claimJurisdiction is given', () => {
      const body = { claimJurisdiction: CaseTypeId.ENGLAND_WALES };

      const req = mockRequest({ body });
      const res = mockResponse();
      new ClaimJurisdictionSelectionController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.ACAS_MULTIPLE_CLAIM);
    });
  });
});
