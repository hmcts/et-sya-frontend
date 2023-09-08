import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, Rule92Types, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { setUserCase } from './helpers/CaseHelpers';
import { getCaptionTextForCopyToOtherParty } from './helpers/CopyToOtherPartyHelper';
import { getCopyToOtherPartyError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getCancelLink } from './helpers/Rule92NotSystemUserHelper';

export default class CopyToOtherPartyController {
  private readonly form: Form;

  private readonly CopyToOtherPartyContent: FormContent = {
    fields: {
      copyToOtherPartyYesOrNo: {
        classes: 'govuk-radios',
        id: 'copyToOtherPartyYesOrNo',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'l',
        values: [
          {
            name: 'copyToOtherPartyYesOrNo',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'copyToOtherPartyYesOrNo',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
            subFields: {
              copyToOtherPartyText: {
                id: 'copyToOtherPartyText',
                name: 'copyToOtherPartyText',
                type: 'textarea',
                label: (l: AnyRecord): string => l.hintText,
                labelSize: 'm',
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
    this.form = new Form(<FormFields>this.CopyToOtherPartyContent.fields);
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
      return res.redirect(PageUrls.COPY_TO_OTHER_PARTY + languageParam);
    }
    let redirectPage = '';
    if (req.session.contactType === Rule92Types.CONTACT) {
      redirectPage = PageUrls.CONTACT_THE_TRIBUNAL_CYA + languageParam;
    } else if (req.session.contactType === Rule92Types.RESPOND) {
      redirectPage = PageUrls.RESPONDENT_APPLICATION_CYA + languageParam;
    } else if (req.session.contactType === Rule92Types.TRIBUNAL) {
      redirectPage = PageUrls.TRIBUNAL_RESPONSE_CYA + languageParam;
    }
    return res.redirect(redirectPage);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.CopyToOtherPartyContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COPY_TO_OTHER_PARTY,
    ]);

    const captionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.COPY_TO_OTHER_PARTY, { returnObjects: true }),
    };

    res.render(TranslationKeys.COPY_TO_OTHER_PARTY, {
      ...content,
      copyToOtherPartyYesOrNo: getCaptionTextForCopyToOtherParty(req, captionTranslations),
      cancelLink: getCancelLink(req),
    });
  };
}
