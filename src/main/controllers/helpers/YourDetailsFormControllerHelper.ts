import { CaseWithId } from '../../definitions/case';
import { DefaultValues } from '../../definitions/constants';

export default class YourDetailsFormControllerHelper {
  /**
   * Generates case with id for empty req.session.userCase value.
   * We use this data to send it to the form the reassign entered values back in the form fields.
   * For createdDate, lastModified and state values we use default values as empty string and undefined
   * @param formData  gets the following fields from formData which is partially CaseWithId.
   *                  id Case id, usually referred as case submission reference entered to the form by claimant.
   *                  id value can be only 16 digit decimal or 16 digit divided by dash like 1234-5678-1234-5678.
   *                  If it is divided by dash, this method automatically removes dash values with empty string.
   *                  firstName First Name of the claimant entered to the form by splitting claimantName.
   *                  lastName Last name of the claimant entered to the for by splitting claimantName.
   */
  public static readonly generateBasicUserCaseByYourDetailsFormData = (formData: Partial<CaseWithId>): CaseWithId => {
    return <CaseWithId>{
      createdDate: DefaultValues.STRING_EMPTY,
      lastModified: DefaultValues.STRING_EMPTY,
      state: undefined,
      id: formData.id,
      claimantName: formData.claimantName,
      firstName: formData.claimantName.split(' ')[0],
      lastName: formData.claimantName.split(' ')[1],
      respondentName: DefaultValues.STRING_EMPTY,
    };
  };
}
