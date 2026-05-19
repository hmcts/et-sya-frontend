import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { StillWorking } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { renderPage } from './helpers/NonHmctsControllerHelper';

const logger = getLogger('IsClaimantStillWorkingController');

const getRedirectUrl = (isStillWorking: string): string => {
  if (isStillWorking === StillWorking.NO_LONGER_WORKING) {
    return PageUrls.END_DATE;
  }
  return PageUrls.CLAIMANT_EMPLOYMENT_DETAILS;
};

export default class IsClaimantStillWorkingController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      isStillWorking: {
        classes: 'govuk-radios',
        id: 'is-claimant-still-working',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
        values: [
          { name: 'working', label: (l: AnyRecord): string => l.optionText1, value: StillWorking.WORKING },
          { name: 'working_notice', label: (l: AnyRecord): string => l.optionText2, value: StillWorking.NOTICE },
          {
            name: 'not_working',
            label: (l: AnyRecord): string => l.optionText3,
            value: StillWorking.NO_LONGER_WORKING,
          },
        ],
      },
    },
    submit: { text: (l: AnyRecord): string => l.submit, classes: 'govuk-!-margin-right-2' },
    saveForLater: { text: (l: AnyRecord): string => l.saveForLater, classes: 'govuk-button--secondary' },
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const { isStillWorking } = req.body;
    if (isStillWorking !== StillWorking.NO_LONGER_WORKING) {
      req.session.userCase.endDate = undefined;
    }
    if (isStillWorking !== StillWorking.NOTICE) {
      req.session.userCase.noticeEnds = undefined;
    }
    await handlePostLogic(req, res, this.form, logger, getRedirectUrl(isStillWorking));
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.IS_CLAIMANT_STILL_WORKING);
  };
}
