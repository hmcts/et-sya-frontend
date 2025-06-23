import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { StillWorking } from '../definitions/case';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
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
    switch (req.body.isStillWorking) {
      case StillWorking.WORKING:
        req.session.userCase.endDate = undefined;
        req.session.userCase.noticeEnds = undefined;
        return handlePostLogic(req, res, this.form, logger, PageUrls.JOB_TITLE, false);

      case StillWorking.NOTICE:
        req.session.userCase.endDate = undefined;
        return handlePostLogic(req, res, this.form, logger, PageUrls.NOTICE_END, true);

      case StillWorking.NO_LONGER_WORKING:
        req.session.userCase.noticeEnds = undefined;
        return handlePostLogic(req, res, this.form, logger, PageUrls.END_DATE, true);

      default:
        return res.redirect(ErrorPages.NOT_FOUND);
    }
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
