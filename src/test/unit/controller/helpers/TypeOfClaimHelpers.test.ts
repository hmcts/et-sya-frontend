import config from 'config';

import { getRedirectUrl } from '../../../../main/controllers/helpers/TypeOfClaimHelpers';
import { PageUrls } from '../../../../main/definitions/constants';
import { TypesOfClaim } from '../../../../main/definitions/definition';
import { FormField } from '../../../../main/definitions/form';
import { mockForm } from '../../mocks/mockForm';
import { mockRequest } from '../../mocks/mockRequest';

describe('Type of Claim Helpers Test getRedirectUrl', () => {
  const req = mockRequest({});
  const formField = {
    id: 'typeOfClaim',
    type: 'checkboxes',
    values: [
      {
        id: 'breachOfContract',
        name: 'typeOfClaim',
        value: TypesOfClaim.BREACH_OF_CONTRACT,
      },
      {
        id: 'discrimination',
        name: 'typeOfClaim',
        value: TypesOfClaim.DISCRIMINATION,
      },
    ],
  } as FormField;
  const form = mockForm({ typeOfClaim: formField });

  it('Postcode in Expansion, selected DISCRIMINATION, returns CLAIM_STEPS', () => {
    req.session.userCase.workPostcode = 'G2 8GT'; // Glasgow
    req.body = {
      typeOfClaim: [TypesOfClaim.DISCRIMINATION],
    };
    const actual = getRedirectUrl(req, form);
    expect(actual).toStrictEqual(PageUrls.CLAIM_STEPS);
  });

  it('Postcode in Expansion, selected BREACH_OF_CONTRACT, returns CLAIM_STEPS', () => {
    req.session.userCase.workPostcode = 'G2 8GT'; // Glasgow
    req.body = {
      typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT],
    };
    const actual = getRedirectUrl(req, form);
    expect(actual).toStrictEqual(PageUrls.CLAIM_STEPS);
  });

  it('Postcode not in Expansion, selected both, returns CLAIM_STEPS', () => {
    req.session.userCase.workPostcode = 'M2 1AB'; // Manchester
    req.body = {
      typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT, TypesOfClaim.DISCRIMINATION],
    };
    const actual = getRedirectUrl(req, form);
    expect(actual).toStrictEqual(PageUrls.CLAIM_STEPS);
  });

  it('Postcode not in Expansion, selected BREACH_OF_CONTRACT, returns url', () => {
    req.session.userCase.workPostcode = 'M2 1AB'; // Manchester
    req.body = {
      typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT],
    };
    const actual = getRedirectUrl(req, form);
    const expected = process.env.ET1_BASE_URL ?? config.get('services.et1Legacy.url');
    expect(actual).toStrictEqual(expected);
  });
});
