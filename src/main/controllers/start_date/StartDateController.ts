import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { StillWorking } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class startDateController {
  private readonly form: Form;

  constructor(private readonly startDateFormContent: FormContent) {
    this.form = new Form(<FormFields>this.startDateFormContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    let redirectUrl = '';
    const stillWorking = req.session.userCase.isStillWorking;
    if (stillWorking === StillWorking.WORKING) {
      redirectUrl = PageUrls.NOTICE_PERIOD;
    } else if (stillWorking === StillWorking.NOTICE) {
      redirectUrl = PageUrls.NOTICE_END;
    } else if (stillWorking === StillWorking.NO_LONGER_WORKING) {
      // TODO: redirect to end date page
      redirectUrl = PageUrls.HOME;
    }
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.startDateFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.START_DATE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.START_DATE, {
      ...content,
    });
  };
}
