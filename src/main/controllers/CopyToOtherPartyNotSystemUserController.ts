import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, Rule92Types, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { setUserCase } from './helpers/CaseHelpers';
import { getCancelLink, getCaptionText, getTodayPlus7DaysStrings } from './helpers/Rule92NotSystemUserHelper';
import { getCopyToOtherPartyError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class CopyToOtherPartyNotSystemUserController {
  private readonly form: Form;

  private readonly CopyToOtherPartyNotSystemUserContent: FormContent = {
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
    this.form = new Form(<FormFields>this.CopyToOtherPartyNotSystemUserContent.fields);
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
      return res.redirect(PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER + languageParam);
    }
    let redirectPage = '';
    if (req.body.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      if (req.session.contactType === Rule92Types.CONTACT) {
        redirectPage = PageUrls.CONTACT_THE_TRIBUNAL_CYA + languageParam;
      } else if (req.session.contactType === Rule92Types.TRIBUNAL) {
        redirectPage = PageUrls.TRIBUNAL_RESPONSE_CYA + languageParam;
      }
    } else {
      if (req.session.contactType === Rule92Types.CONTACT) {
        redirectPage = PageUrls.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER + languageParam;
      } else if (req.session.contactType === Rule92Types.TRIBUNAL) {
        redirectPage = PageUrls.TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER + languageParam;
      }
    }
    return res.redirect(redirectPage);
  };

  public get = (req: AppRequest, res: Response): void => {
    const applicationTypeTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
    };

    const content = getPageContent(req, this.CopyToOtherPartyNotSystemUserContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER,
    ]);

    res.render(TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER, {
      ...content,
      applicationType: getCaptionText(req, applicationTypeTranslations),
      appDatePlusSeven: getTodayPlus7DaysStrings(),
      cancelLink: getCancelLink(req),
    });
  };
}
