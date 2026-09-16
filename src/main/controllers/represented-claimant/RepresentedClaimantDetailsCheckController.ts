import { validateRepresentedClaimantDetails } from '../../components/form/claim-details-validator';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import PersonalDetailsCheckController from '../PersonalDetailsCheckController';

export default class RepresentedClaimantDetailsCheckController extends PersonalDetailsCheckController {
  constructor() {
    super(
      'representedClaimantDetailsCheck',
      TranslationKeys.REPRESENTED_CLAIMANT_DETAILS_CHECK,
      validateRepresentedClaimantDetails,
      () => PageUrls.CLAIM_STEPS_NON_HMCTS,
      'RepresentedClaimantDetailsCheckController'
    );
  }
}
