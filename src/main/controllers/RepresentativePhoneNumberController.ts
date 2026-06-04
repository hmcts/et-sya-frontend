import { Response } from 'express';

import { Form } from '../components/form/form';
import { isValidUKTelNumber } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { getRepAboutYouPageContent, isClaimantRepAboutYouFlow } from './helpers/ClaimantRepAboutYouHelper';
import { assignFormData } from './helpers/FormHelpers';

const logger = getLogger('RepresentativePhoneNumberController');

export default class RepresentativePhoneNumberController {
  private readonly form: Form;
  private readonly phoneNumberContent: FormContent = {
    fields: {
      representativePhoneNumber: {
        id: 'representativePhoneNumber',
        name: 'representativePhoneNumber',
        type: 'tel',
        classes: 'govuk-input--width-20',
        label: (l: AnyRecord): string => l.phoneNumber,
        attributes: {
          autocomplete: 'tel',
        },
        validator: isValidUKTelNumber,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.phoneNumberContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (isClaimantRepAboutYouFlow(req)) {
      const caseId = req.session.repAboutYouCaseId ?? req.session.userCase?.id;
      await handlePostLogic(
        req,
        res,
        this.form,
        logger,
        PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId),
        true
      );
      req.session.repAboutYouCaseId = undefined;
      return;
    }
    await handlePostLogic(req, res, this.form, logger, PageUrls.REPRESENTATIVE_COMMS_PREFERENCE);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getRepAboutYouPageContent(req, this.phoneNumberContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REPRESENTATIVE_PHONE_NUMBER,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.REPRESENTATIVE_PHONE_NUMBER, {
      ...content,
    });
  };
}
