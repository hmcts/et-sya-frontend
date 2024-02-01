import config from 'config';
import { parse } from 'postcode';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, inScopeLocationsExpansion } from '../../definitions/constants';
import { TypesOfClaim } from '../../definitions/definition';

import { conditionalRedirect } from './RouterHelpers';

export const getRedirectUrl = (req: AppRequest, form: Form): string => {
  if (isPostcodeExpansionInScope(req.session.userCase?.workPostcode)) {
    return PageUrls.CLAIM_STEPS;
  } else if (
    conditionalRedirect(req, form.getFormFields(), [TypesOfClaim.DISCRIMINATION]) ||
    conditionalRedirect(req, form.getFormFields(), [TypesOfClaim.WHISTLE_BLOWING])
  ) {
    return PageUrls.CLAIM_STEPS;
  } else {
    const url: string = process.env.ET1_BASE_URL ?? config.get('services.et1Legacy.url');
    return `${url}`;
  }
};

const isPostcodeExpansionInScope = (postCode: string): boolean => {
  if (!postCode) {
    return false;
  }
  const {
    outcode, // => "SW1A"
    area, // => "SW"
    district, // => "SW1"
  } = parse(postCode);
  for (const location of inScopeLocationsExpansion) {
    if (location === outcode || location === area || location === district) {
      return true;
    }
  }
  return false;
};
