import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { StillWorking } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('StillWorkingController');

export default class StillWorkingController {
  private readonly form: Form;
  private readonly stillWorkingContent: FormContent = {
    fields: {
      isStillWorking: {
        classes: 'govuk-radios',
        id: 'still-working',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
        values: [
          {
            name: 'working',
            label: (l: AnyRecord): string => l.optionText1,
            value: StillWorking.WORKING,
          },
          {
            name: 'working_notice',
            label: (l: AnyRecord): string => l.optionText2,
            value: StillWorking.NOTICE,
          },
          {
            name: 'not_working',
            label: (l: AnyRecord): string => l.optionText3,
            value: StillWorking.NO_LONGER_WORKING,
          },
        ],
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
    this.form = new Form(<FormFields>this.stillWorkingContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.isStillWorking !== StillWorking.NO_LONGER_WORKING) {
      req.session.userCase.endDate = undefined;
    }
    if (req.body.isStillWorking !== StillWorking.NOTICE) {
      req.session.userCase.noticeEnds = undefined;
    }

    let redirectUrl: string = PageUrls.JOB_TITLE;
    let shouldUseRedirectUrl = false;

    if (req.session.returnUrl?.includes(PageUrls.CHECK_ANSWERS)) {
      if (req.body.isStillWorking === StillWorking.NOTICE) {
        redirectUrl = PageUrls.NOTICE_END;
        shouldUseRedirectUrl = true;
      } else if (req.body.isStillWorking === StillWorking.NO_LONGER_WORKING) {
        redirectUrl = PageUrls.END_DATE;
        shouldUseRedirectUrl = true;
      }
    }

    await handlePostLogic(req, res, this.form, logger, redirectUrl, shouldUseRedirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.stillWorkingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.STILL_WORKING,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.STILL_WORKING, {
      ...content,
    });
  };
}
