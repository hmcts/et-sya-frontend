import { validateRepresentativeDetails } from '../../components/form/claim-details-validator';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import PersonalDetailsCheckController from '../PersonalDetailsCheckController';

export default class RepresentativeDetailsCheckController extends PersonalDetailsCheckController {
  constructor() {
    super(
      'representativeDetailsCheck',
      TranslationKeys.REPRESENTATIVE_DETAILS_CHECK,
      validateRepresentativeDetails,
      () => PageUrls.CLAIM_STEPS_NON_HMCTS,
      'RepresentativeDetailsCheckController'
    );
  }
}
