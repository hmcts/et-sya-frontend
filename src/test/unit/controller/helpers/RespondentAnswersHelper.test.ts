import { getAcasReason } from '../../../../main/controllers/helpers/RespondentAnswersHelper';
import { NoAcasNumberReason } from '../../../../main/definitions/case';
import { AnyRecord } from '../../../../main/definitions/util-types';

const translations: AnyRecord = {
  acasReason: {
    another: 'Another person I’m making a claim with has an Acas early conciliation certificate number',
    no_power: 'Acas doesn’t have the power to conciliate on some or all of my claim',
    employer: 'My employer has already been in touch with Acas',
    unfair_dismissal:
      'The claim consists only of a complaint of unfair dismissal which contains an application for interim relief',
  },
};

describe('getAcasReason', () => {
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
