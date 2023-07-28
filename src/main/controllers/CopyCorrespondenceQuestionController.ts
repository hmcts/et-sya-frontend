import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { retrieveCurrentLocale } from './helpers/ApplicationTableRecordTranslationHelper';
import { setUserCase } from './helpers/CaseHelpers';
import { getCopyToOtherPartyError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class CopyCorrespondenceQuestionController {
  private readonly form: Form;

  private readonly CopyCorrespondenceQuestionContent: FormContent = {
    fields: {
      copyToOtherPartyYesOrNo: {
        classes: 'govuk-radios',
        id: 'copyToOtherPartyYesOrNo',
        type: 'radios',
        label: (l: AnyRecord): string => l.doYouWantToCopy,
        labelHidden: false,
        labelSize: 'm',
        values: [
          {
            name: 'copyToOtherPartyYesOrNo',
            label: (l: AnyRecord): string =>
              '<p class="govuk-body">' +
              l.yesIConfirmIWill +
              '</p><p class="govuk-body"><strong>' +
              l.important +
              ':</strong> ' +
              l.doNotSubmitYourApplication +
              '</p><p class="govuk-body">' +
              l.youShouldAlsoNotify +
              ' ' +
              l.appDatePlusSeven +
              '</p>',
            value: YesOrNo.YES,
          },
          {
            name: 'copyToOtherPartyYesOrNo',
            label: (l: AnyRecord): string =>
              '<p class="govuk-body">' +
              l.noIDoNotWantTo +
              '</p><p class="govuk-body"><strong>' +
              l.important +
              ':</strong> ' +
              l.youMustTellTheTribunal +
              '</p>',
            value: YesOrNo.NO,
            subFields: {
              copyToOtherPartyText: {
                id: 'copyToOtherPartyText',
                name: 'copyToOtherPartyText',
                type: 'textarea',
                label: (l: AnyRecord): string => l.giveDetails,
                labelSize: 's',
                isPageHeading: true,
                classes: 'govuk-textarea',
              },
            },
          },
        ],
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
      classes: 'govuk-!-margin-right-2',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.CopyCorrespondenceQuestionContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.copyToOtherPartyYesOrNo === YesOrNo.YES) {
      req.body.copyToOtherPartyText = undefined;
    }
    setUserCase(req, this.form);
    const languageParam = getLanguageParam(req.url);
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const copyToOtherPartyError = getCopyToOtherPartyError(formData);
    req.session.errors = [];
    if (copyToOtherPartyError) {
      req.session.errors.push(copyToOtherPartyError);
      return res.redirect(PageUrls.COPY_CORRESPONDENCE_QUESTION + languageParam);
    }
    return res.redirect(PageUrls.CHECK_YOUR_ANSWERS_RULE92 + languageParam);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.CopyCorrespondenceQuestionContent, [
      TranslationKeys.COMMON,
      TranslationKeys.COPY_CORRESPONDENCE_QUESTION,
    ]);
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECKLIST);
    res.render(TranslationKeys.COPY_CORRESPONDENCE_QUESTION, {
      ...content,
      cancelLink: redirectUrl,
      appDatePlusSeven: getTodayPlus7DaysStrings(req),
    });
  };
}

const getTodayPlus7DaysStrings = (req: AppRequest): string => {
  const applicationDate = new Date();
  applicationDate.setDate(applicationDate.getDate() + 7);
  return applicationDate.toLocaleDateString(retrieveCurrentLocale(req?.url), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
