import { getAddressesForPostcode } from '../../address';
import { CaseWithId } from '../../definitions/case';
export const getAddresses = async (
  userCase: CaseWithId
): Promise<{ text: unknown; value?: unknown; selected?: unknown }[]> => {
  const addressesFromPostcode = await getAddressesForPostcode(userCase.enterPostcode);
  const addresses = [];
  for (const address of addressesFromPostcode) {
    addresses.push({
      selected: false,
      value: address.fullAddress,
      text: address.fullAddress,
    });
  }

  return addresses;
};
