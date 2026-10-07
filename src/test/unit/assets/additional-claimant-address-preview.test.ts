/**
 * @jest-environment ./jest.environment.jsdom.js
 */

const renderAdditionalClaimantAddressPreviewDom = (selectedIndex = 0): void => {
  document.body.innerHTML = `
    <select id="additionalClaimantAddressTypes">
      <option selected>Several addresses found</option>
      <option value="0">17, Pantyblawd Road, Llansamlet, Abertawe, Wales, SA7 9RN</option>
      <option value="1">10, Test Street, Swansea, Wales, SA1 1AA</option>
    </select>
    <div class="govuk-form-group additionalClaimantAddress1 hidden">
      <input id="additionalClaimantAddress1" type="text" />
    </div>
    <div class="govuk-form-group additionalClaimantAddress2 hidden">
      <input id="additionalClaimantAddress2" type="text" />
    </div>
    <div class="govuk-form-group additionalClaimantAddressTown hidden">
      <input id="additionalClaimantAddressTown" type="text" />
    </div>
    <div class="govuk-form-group additionalClaimantAddressCountry hidden">
      <input id="additionalClaimantAddressCountry" type="text" />
    </div>
    <div class="govuk-form-group additionalClaimantAddressPostcode hidden">
      <input id="additionalClaimantAddressPostcode" type="text" />
    </div>
    <div id="additional-claimant-address-data" class="hidden">
      <div
        class="js-additional-claimant-address-data"
        data-line1="17, Pantyblawd Road"
        data-line2="Llansamlet"
        data-town="Abertawe"
        data-country="Wales"
        data-postcode="SA7 9RN"
      ></div>
      <div
        class="js-additional-claimant-address-data"
        data-line1="10, Test Street"
        data-line2=""
        data-town="Swansea"
        data-country="Wales"
        data-postcode="SA1 1AA"
      ></div>
    </div>
  `;
  const select = document.getElementById('additionalClaimantAddressTypes') as HTMLSelectElement;
  select.selectedIndex = selectedIndex;
};

describe('additional claimant postcode-select address preview', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    jest.resetModules();
  });

  it('shows selected additional claimant address values when an address is selected', async () => {
    renderAdditionalClaimantAddressPreviewDom(1);
    await import('../../../main/assets/js/additional-claimant-address-preview');

    const select = document.getElementById('additionalClaimantAddressTypes') as HTMLSelectElement;
    select.dispatchEvent(new window.Event('change'));

    const line1Group = document.querySelector('.additionalClaimantAddress1');
    const line1 = document.getElementById('additionalClaimantAddress1') as HTMLInputElement;
    const line2 = document.getElementById('additionalClaimantAddress2') as HTMLInputElement;
    const town = document.getElementById('additionalClaimantAddressTown') as HTMLInputElement;
    const country = document.getElementById('additionalClaimantAddressCountry') as HTMLInputElement;
    const postcode = document.getElementById('additionalClaimantAddressPostcode') as HTMLInputElement;

    expect(line1Group.classList.contains('hidden')).toBe(true);
    expect(line1.value).toBe('17, Pantyblawd Road');
    expect(line2.value).toBe('Llansamlet');
    expect(town.value).toBe('Abertawe');
    expect(country.value).toBe('Wales');
    expect(postcode.value).toBe('SA7 9RN');
  });

  it('hides fields for default selection and updates values on change', async () => {
    renderAdditionalClaimantAddressPreviewDom(0);
    await import('../../../main/assets/js/additional-claimant-address-preview');

    const line1Group = document.querySelector('.additionalClaimantAddress1');
    const select = document.getElementById('additionalClaimantAddressTypes') as HTMLSelectElement;
    const line1 = document.getElementById('additionalClaimantAddress1') as HTMLInputElement;
    const line2 = document.getElementById('additionalClaimantAddress2') as HTMLInputElement;
    const town = document.getElementById('additionalClaimantAddressTown') as HTMLInputElement;
    const country = document.getElementById('additionalClaimantAddressCountry') as HTMLInputElement;
    const postcode = document.getElementById('additionalClaimantAddressPostcode') as HTMLInputElement;

    expect(line1Group.classList.contains('hidden')).toBe(true);
    expect(line1.value).toBe('');
    expect(line2.value).toBe('');
    expect(town.value).toBe('');
    expect(country.value).toBe('');
    expect(postcode.value).toBe('');

    select.selectedIndex = 2;
    select.dispatchEvent(new window.Event('change'));

    expect(line1Group.classList.contains('hidden')).toBe(true);
    expect(line1.value).toBe('10, Test Street');
    expect(line2.value).toBe('');
    expect(town.value).toBe('Swansea');
    expect(country.value).toBe('Wales');
    expect(postcode.value).toBe('SA1 1AA');
  });
});
