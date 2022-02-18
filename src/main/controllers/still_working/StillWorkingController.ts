import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { FormContent, FormFields } from '../../definitions/form';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';
export default class StillWorkingController {
  private readonly form: Form;

  constructor(private readonly stillWorkingContent: FormContent) {
    this.form = new Form(<FormFields>this.stillWorkingContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    let redirectUrl = '';
    if (req.body.isStillWorking === 'WORKING') {
      // TODO update url with employment details(WORKING) page
      redirectUrl = '/';
    } else if (req.body.isStillWorking === 'NOTICE') {
      // TODO update url with employment details(NOTICE) page
      redirectUrl = '/';
    } else if (req.body.isStillWorking === 'NO LONGER WORKING') {
      // TODO update url with employment details(NO LONGER WORKING) page
      redirectUrl = '/';
    } else {
      redirectUrl = PageUrls.STILL_WORKING;
    }

    handleSessionErrors(req, res, this.form, redirectUrl);
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
