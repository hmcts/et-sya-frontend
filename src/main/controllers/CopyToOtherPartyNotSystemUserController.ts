import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { setUserCase } from './helpers/CaseHelpers';
import { getCaptionTextForCopyToOtherParty, getRedirectPageUrlNotSystemUser } from './helpers/CopyToOtherPartyHelper';
import { getCopyToOtherPartyError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getCancelLink } from './helpers/Rule92NotSystemUserHelper';

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
    return res.redirect(getRedirectPageUrlNotSystemUser(req) + languageParam);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.CopyToOtherPartyNotSystemUserContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER,
    ]);

    res.render(TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER, {
      ...content,
      applicationType: getCaptionTextForCopyToOtherParty(req),
      cancelLink: getCancelLink(req),
    });
  };
}
