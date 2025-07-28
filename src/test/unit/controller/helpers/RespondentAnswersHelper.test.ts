import {
  getAcasReason,
  getRespondentDetailsSection,
  getRespondentSection,
} from '../../../../main/controllers/helpers/RespondentAnswersHelper';
import { NoAcasNumberReason, Respondent, YesOrNo } from '../../../../main/definitions/case';
import { AnyRecord } from '../../../../main/definitions/util-types';
import checkYourAnswersJson from '../../../../main/resources/locales/en/translation/check-your-answers.json';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import et1DetailsJson from '../../../../main/resources/locales/en/translation/et1-details.json';
import respondentDetailsCheckJson from '../../../../main/resources/locales/en/translation/respondent-details-check.json';
import mockUserCase from '../../mocks/mockUserCase';

describe('getAcasReason', () => {
  const translations: AnyRecord = {
    acasReason: {
      another: 'Another person I’m making a claim with has an Acas early conciliation certificate number',
      no_power: 'Acas doesn’t have the power to conciliate on some or all of my claim',
      employer: 'My employer has already been in touch with Acas',
      unfair_dismissal:
        'The claim consists only of a complaint of unfair dismissal which contains an application for interim relief',
    },
  };

  it('should return another when NoAcasNumberReason.ANOTHER', () => {
    expect(getAcasReason(NoAcasNumberReason.ANOTHER, translations)).toStrictEqual(translations.acasReason.another);
  });

  it('should return no_power when NoAcasNumberReason.NO_POWER', () => {
    expect(getAcasReason(NoAcasNumberReason.NO_POWER, translations)).toStrictEqual(translations.acasReason.no_power);
  });

  it('should return employer when NoAcasNumberReason.EMPLOYER', () => {
    expect(getAcasReason(NoAcasNumberReason.EMPLOYER, translations)).toStrictEqual(translations.acasReason.employer);
  });

  it('should return unfair_dismissal when NoAcasNumberReason.UNFAIR_DISMISSAL', () => {
    expect(getAcasReason(NoAcasNumberReason.UNFAIR_DISMISSAL, translations)).toStrictEqual(
      translations.acasReason.unfair_dismissal
    );
  });

  it('should return undefined when not found', () => {
    expect(getAcasReason(undefined, translations)).toStrictEqual(undefined);
  });
});

describe('getRespondentSection', () => {
  const translations: AnyRecord = { ...checkYourAnswersJson, ...et1DetailsJson, ...commonJson };

  const respondent: Respondent = {
    respondentName: 'Acme Corp',
    respondentAddress1: '1 Acme Way',
    respondentAddress2: '',
    respondentAddressTown: 'London',
    respondentAddressCountry: 'UK',
    respondentAddressPostcode: 'AC1 2XY',
    acasCert: YesOrNo.YES,
    acasCertNum: 'ACAS123456',
  };

  const userCase = mockUserCase;

  it('should include remove link if index > 1 and addRemoveButton is true', () => {
    const result = getRespondentSection(userCase, respondent, 2, translations, '?lang=en', true);
    expect(result).toStrictEqual([
      {
        actions: {
          items: [
            {
              href: '/respondent/2/respondent-remove?lang=en&redirect=answers',
              text: 'Remove respondent',
              visuallyHiddenText: 'Remove respondent',
            },
          ],
        },
        key: {
          classes: 'govuk-heading-m',
          text: 'Respondent 2 details',
        },
        value: {
          text: '',
        },
      },
      {
        actions: {
          items: [
            {
              href: '/respondent/2/respondent-name/change?redirect=answers',
              text: 'Change',
              visuallyHiddenText: 'Name of respondent',
            },
          ],
        },
        key: {
          classes: 'govuk-!-font-weight-regular-m',
          text: 'Name of respondent',
        },
        value: {
          text: 'Acme Corp',
        },
      },
      {
        actions: {
          items: [
            {
              href: '/respondent/2/respondent-postcode-enter/change?redirect=answers',
              text: 'Change',
              visuallyHiddenText: 'Respondent address',
            },
          ],
        },
        key: {
          classes: 'govuk-!-font-weight-regular-m',
          text: 'Respondent address',
        },
        value: {
          text: '1 Acme Way, London, UK, AC1 2XY',
        },
      },
      {
        actions: {
          items: [
            {
              href: '/respondent/2/acas-cert-num/change?redirect=answers',
              text: 'Change',
              visuallyHiddenText: 'Do you have an Acas certificate number?',
            },
          ],
        },
        key: {
          classes: 'govuk-!-font-weight-regular-m',
          text: 'Do you have an Acas certificate number?',
        },
        value: {
          text: 'ACAS123456',
        },
      },
    ]);
  });

  it('should include remove link if index = 1 and addRemoveButton is true', () => {
    userCase.pastEmployer = YesOrNo.YES;
    userCase.claimantWorkAddressQuestion = YesOrNo.NO;
    respondent.acasCert = YesOrNo.NO;
    respondent.noAcasReason = NoAcasNumberReason.ANOTHER;
    const result = getRespondentSection(userCase, respondent, 1, translations, '?lang=en', true);
    expect(result).toStrictEqual([
      {
        key: {
          classes: 'govuk-heading-m',
          text: 'Respondent 1 details',
        },
        value: {
          text: '',
        },
      },
      {
        actions: {
          items: [
            {
              href: '/respondent/1/respondent-name/change?redirect=answers',
              text: 'Change',
              visuallyHiddenText: 'Name of respondent',
            },
          ],
        },
        key: {
          classes: 'govuk-!-font-weight-regular-m',
          text: 'Name of respondent',
        },
        value: {
          text: 'Acme Corp',
        },
      },
      {
        actions: {
          items: [
            {
              href: '/respondent/1/respondent-postcode-enter/change?redirect=answers',
              text: 'Change',
              visuallyHiddenText: 'Respondent address',
            },
          ],
        },
        key: {
          classes: 'govuk-!-font-weight-regular-m',
          text: 'Respondent address',
        },
        value: {
          text: '1 Acme Way, London, UK, AC1 2XY',
        },
      },
      {
        actions: {
          items: [
            {
              href: '/respondent/1/work-address/change?redirect=answers',
              text: 'Change',
              visuallyHiddenText: "Did you work at the respondent's address?",
            },
          ],
        },
        key: {
          classes: 'govuk-!-font-weight-regular-m',
          text: "Did you work at the respondent's address?",
        },
        value: {
          text: 'No',
        },
      },
      {
        actions: {
          items: [
            {
              href: '/respondent/1/place-of-work/change?redirect=answers',
              text: 'Change',
              visuallyHiddenText: 'The address you work or worked at',
            },
          ],
        },
        key: {
          classes: 'govuk-!-font-weight-regular-m',
          text: 'The address you work or worked at',
        },
        value: {
          text: 'Not provided',
        },
      },
      {
        actions: {
          items: [
            {
              href: '/respondent/1/acas-cert-num/change?redirect=answers',
              text: 'Change',
              visuallyHiddenText: 'Do you have an Acas certificate number?',
            },
          ],
        },
        key: {
          classes: 'govuk-!-font-weight-regular-m',
          text: 'Do you have an Acas certificate number?',
        },
        value: {
          text: 'No',
        },
      },
      {
        actions: {
          items: [
            {
              href: '/respondent/1/no-acas-reason/change?redirect=answers',
              text: 'Change',
              visuallyHiddenText: 'Why do you not have an Acas Number?',
            },
          ],
        },
        key: {
          classes: 'govuk-!-font-weight-regular-m',
          text: 'Why do you not have an Acas Number?',
        },
        value: {
          text: 'Another person I’m making a claim with has an Acas early conciliation certificate number',
        },
      },
    ]);
  });
});

describe('getRespondentDetailsSection', () => {
  const translations: AnyRecord = { ...respondentDetailsCheckJson };

  it('should return rows when acasCert = Yes', () => {
    const respondent: Respondent = {
      respondentName: 'Acme Corp',
      respondentAddress1: '1 Acme Way',
      respondentAddress2: '',
      respondentAddressTown: 'London',
      respondentAddressCountry: 'UK',
      respondentAddressPostcode: 'AC1 2XY',
      acasCert: YesOrNo.YES,
      acasCertNum: 'ACAS123456',
    };

    const result = getRespondentDetailsSection(respondent, '2', translations);

    expect(result).toStrictEqual([
      {
        actions: {
          items: [
            {
              href: '/respondent/2/respondent-name/change?redirect=respondent',
              text: 'Change',
              visuallyHiddenText: 'Name',
            },
          ],
        },
        key: {
          text: 'Name',
        },
        value: {
          text: 'Acme Corp',
        },
      },
      {
        actions: {
          items: [
            {
              href: '/respondent/2/respondent-postcode-enter/change?redirect=respondent',
              text: 'Change',
              visuallyHiddenText: 'Address',
            },
          ],
        },
        key: {
          text: 'Address',
        },
        value: {
          text: '1 Acme Way, London, UK, AC1 2XY',
        },
      },
      {
        actions: {
          items: [
            {
              href: '/respondent/2/acas-cert-num/change?redirect=respondent',
              text: 'Change',
              visuallyHiddenText: 'Acas certificate number',
            },
          ],
        },
        key: {
          text: 'Acas certificate number',
        },
        value: {
          html: 'ACAS123456',
        },
      },
    ]);
  });

  it('should return rows when acasCert = No', () => {
    const respondent: Respondent = {
      respondentName: 'Acme Corp',
      respondentAddress1: '1 Acme Way',
      respondentAddress2: '',
      respondentAddressTown: 'London',
      respondentAddressCountry: 'UK',
      respondentAddressPostcode: 'AC1 2XY',
      acasCert: YesOrNo.NO,
      noAcasReason: NoAcasNumberReason.ANOTHER,
    };

    const result = getRespondentDetailsSection(respondent, '1', translations);

    expect(result).toContainEqual({
      actions: {
        items: [
          {
            href: '/respondent/1/acas-cert-num/change?redirect=respondent',
            text: 'Change',
            visuallyHiddenText: 'Acas certificate number',
          },
        ],
      },
      key: {
        text: 'Acas certificate number',
      },
      value: {
        html: 'Not provided',
      },
    });
    expect(result).toContainEqual({
      actions: {
        items: [
          {
            href: '/respondent/1/acas-cert-num/change?redirect=respondent',
            text: 'Change',
            visuallyHiddenText: 'Acas certificate number',
          },
        ],
      },
      key: {
        text: 'Why do you not have an Acas Number?',
      },
      value: {
        html: 'Another person I’m making a claim with has an Acas early conciliation certificate number',
      },
    });
  });
});
