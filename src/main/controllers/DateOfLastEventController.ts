import { Response } from 'express';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate, YesOrNo } from '../definitions/case';
import { FEATURE_FLAGS, PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, DateOfLastEventFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { UnknownRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const date_of_last_event: DateFormFields = {
  ...DateOfLastEventFormFields,
  id: 'dateOfLastEvent',
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('dateOfLastEvent', body),
};

const logger = getLogger('DateOfLastEventController');

export default class DateOfLastEventController {
  private readonly form: Form;
  private readonly dateOfLastEventFormContent: FormContent = {
    fields: { dateOfLastEvent: date_of_last_event },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.dateOfLastEventFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const nextPage = this.getNextPage(req);
    if (!(await getFlagValue(FEATURE_FLAGS.ERA_OCTOBER_2026, null))) {
      res.redirect(nextPage);
      return;
    }
    await handlePostLogic(req, res, this.form, logger, nextPage);
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    if (!(await getFlagValue(FEATURE_FLAGS.ERA_OCTOBER_2026, null))) {
      res.redirect(this.getNextPage(req));
      return;
    }
    const content = getPageContent(req, this.dateOfLastEventFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.DATE_OF_LAST_EVENT,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.DATE_OF_LAST_EVENT, {
      ...content,
    });
  };

  private getNextPage = (req: AppRequest): string =>
    req.session.userCase?.claimantRepresentedQuestion === YesOrNo.YES
      ? PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED
      : PageUrls.DESCRIBE_WHAT_HAPPENED;
}
