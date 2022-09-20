import { CaseWithId, YesOrNo } from '../../definitions/case';
import { ChangeUrls, PageUrls } from '../../definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../../definitions/definition';

export const getClaimDetailsSection = (userCase: CaseWithId): unknown => {
  const rows = [];
  rows.push({
    key: {
      text: 'Claim details',
      classes: 'govuk-heading-m',
    },
  });
  if (userCase.typeOfClaim.includes(TypesOfClaim.DISCRIMINATION)) {
    rows.push({
      key: {
        text: 'What type of discrimination claim are you making?',
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.claimTypeDiscrimination,
      },
      actions: {
        items: [
          {
            href: PageUrls.CLAIM_TYPE_DISCRIMINATION + ChangeUrls.ANSWERS_CHANGE,
            text: 'Change',
            visuallyHiddenText: 'What type of discrimination claim are you making?',
          },
        ],
      },
    });
  }
  if (userCase.typeOfClaim.includes(TypesOfClaim.PAY_RELATED_CLAIM)) {
    rows.push({
      key: {
        text: 'What type of pay claim are you making?',
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.claimTypePay,
      },
      actions: {
        items: [
          {
            href: PageUrls.CLAIM_TYPE_DISCRIMINATION + ChangeUrls.ANSWERS_CHANGE,
            text: 'Change',
            visuallyHiddenText: 'What type of pay claim are you making?',
          },
        ],
      },
    });
  }
  rows.push(
    {
      key: {
        text: 'Describe what happened to you',
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.claimSummaryText,
      },
      actions: {
        items: [
          {
            href: PageUrls.DESCRIBE_WHAT_HAPPENED + ChangeUrls.ANSWERS_CHANGE,
            text: 'Change',
            visuallyHiddenText: 'Describe what happened to you',
          },
        ],
      },
    },
    {
      key: {
        text: 'What do you want if your claim is successful',
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.tellUsWhatYouWant,
      },
      actions: {
        items: [
          {
            href: PageUrls.TELL_US_WHAT_YOU_WANT + ChangeUrls.ANSWERS_CHANGE,
            text: 'Change',
            visuallyHiddenText: 'What do you want if your claim is successful',
          },
        ],
      },
    }
  );

  if (userCase.tellUsWhatYouWant.includes(TellUsWhatYouWant.COMPENSATION_ONLY)) {
    rows.push({
      key: {
        text: 'What compensation are you seeking?',
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.compensationOutcome,
      },
      actions: {
        items: [
          {
            href: PageUrls.COMPENSATION + ChangeUrls.ANSWERS_CHANGE,
            text: 'Change',
            visuallyHiddenText: 'What compensation are you seeking?',
          },
        ],
      },
    });
  }
  if (userCase.tellUsWhatYouWant.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
    rows.push({
      key: {
        text: 'What tribunal recommendation would you like to make?',
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.tribunalRecommendationRequest,
      },
      actions: {
        items: [
          {
            href: PageUrls.TRIBUNAL_RECOMMENDATION + ChangeUrls.ANSWERS_CHANGE,
            text: 'Change',
            visuallyHiddenText: 'What tribunal recommendation would you like to make?',
          },
        ],
      },
    });
  }
  if (userCase.typeOfClaim.includes(TypesOfClaim.WHISTLE_BLOWING)) {
    const whistleBlowingText =
      userCase.whistleblowingClaim === YesOrNo.YES
        ? userCase.whistleblowingClaim + ': ' + userCase.whistleblowingEntityName
        : userCase.whistleblowingClaim;
    rows.push({
      key: {
        text: 'Do you want us to forward your whistleblowing claim to a relevant regulation or body?',
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: whistleBlowingText,
      },
      actions: {
        items: [
          {
            href: PageUrls.WHISTLEBLOWING_CLAIMS + ChangeUrls.ANSWERS_CHANGE,
            text: 'Change',
            visuallyHiddenText: 'Do you want us to forward your whistleblowing claim to a relevant regulation or body?',
          },
        ],
      },
    });
  }
  return rows;
};

export const answersAddressFormatter = (
  line1?: string,
  line2?: string,
  line3?: string,
  line4?: string,
  line5?: string
): string => {
  let addresstring = '';
  if (line1 !== undefined && line1.length > 1) {
    addresstring += line1 + ', ';
  }

  if (line2 !== undefined && line2.length > 1) {
    addresstring += line2 + ', ';
  }
  if (line3 !== undefined && line3.length > 1) {
    addresstring += line3 + ', ';
  }
  if (line4 !== undefined && line4.length > 1) {
    addresstring += line4 + ', ';
  }
  if (line5 !== undefined && line5.length > 1) {
    addresstring += line5 + ', ';
  }
  if (addresstring.length > 1) {
    addresstring = addresstring.slice(0, -2);
  }
  return addresstring;
};
