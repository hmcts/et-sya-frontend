import { Response } from 'express';

import { Form } from '../../components/form/form';
import { isFieldFilledIn } from '../../components/form/validator';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { renderPage } from '../helpers/NonHmctsControllerHelper';

const logger = getLogger('RepresentedClaimantNameController');

export default class RepresentedClaimantNameController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      representedClaimantFirstName: {
        id: 'representedClaimantFirstName',
        name: 'representedClaimantFirstName',
        type: 'text',
        validator: isFieldFilledIn,
        label: (l: AnyRecord): string => l.label,
        attributes: { maxLength: 100 },
      },
      representedClaimantLastName: {
        id: 'representedClaimantLastName',
        name: 'representedClaimantLastName',
        type: 'text',
        validator: isFieldFilledIn,
        label: (l: AnyRecord): string => l.label,
        attributes: { maxLength: 100 },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.REPRESENTED_CLAIMANT_DATE_OF_BIRTH);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.REPRESENTED_CLAIMANT_NAME);
  };
}
