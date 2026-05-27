const additionalClaimantAddressSelect = document.getElementById(
  'additionalClaimantAddressTypes'
) as HTMLSelectElement | null;
const additionalClaimantAddressLine1 = document.getElementById('additionalClaimantAddress1') as HTMLInputElement | null;
const additionalClaimantAddressLine2 = document.getElementById('additionalClaimantAddress2') as HTMLInputElement | null;
const additionalClaimantAddressTown = document.getElementById(
  'additionalClaimantAddressTown'
) as HTMLInputElement | null;
const additionalClaimantAddressCountry = document.getElementById(
  'additionalClaimantAddressCountry'
) as HTMLInputElement | null;
const additionalClaimantAddressPostcode = document.getElementById(
  'additionalClaimantAddressPostcode'
) as HTMLInputElement | null;

if (
  additionalClaimantAddressSelect &&
  additionalClaimantAddressLine1 &&
  additionalClaimantAddressLine2 &&
  additionalClaimantAddressTown &&
  additionalClaimantAddressCountry &&
  additionalClaimantAddressPostcode
) {
  const additionalClaimantAddressRows = Array.from(document.querySelectorAll('.js-additional-claimant-address-data'));

  const clearAdditionalClaimantAddressFields = (): void => {
    additionalClaimantAddressLine1.value = '';
    additionalClaimantAddressLine2.value = '';
    additionalClaimantAddressTown.value = '';
    additionalClaimantAddressCountry.value = '';
    additionalClaimantAddressPostcode.value = '';
  };

  const updateAdditionalClaimantAddressPreview = (): void => {
    const selectedAddressIndex = additionalClaimantAddressSelect.selectedIndex - 1;

    // If they select the placeholder (e.g. "Select an address"), clear the fields
    if (selectedAddressIndex < 0 || selectedAddressIndex >= additionalClaimantAddressRows.length) {
      clearAdditionalClaimantAddressFields();
      return;
    }

    // Otherwise, copy the data values into the visible text inputs
    const selectedAddress = additionalClaimantAddressRows[selectedAddressIndex] as HTMLElement;
    additionalClaimantAddressLine1.value = selectedAddress.dataset.line1 ?? '';
    additionalClaimantAddressLine2.value = selectedAddress.dataset.line2 ?? '';
    additionalClaimantAddressTown.value = selectedAddress.dataset.town ?? '';
    additionalClaimantAddressCountry.value = selectedAddress.dataset.country ?? '';
    additionalClaimantAddressPostcode.value = selectedAddress.dataset.postcode ?? '';
  };

  additionalClaimantAddressSelect.addEventListener('change', updateAdditionalClaimantAddressPreview);
}

export {};
