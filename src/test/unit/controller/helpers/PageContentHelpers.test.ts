import { answersAddressFormatter } from '../../../../main/controllers/helpers/PageContentHelpers';

describe('returnFormattedAddress', () => {
  it('should return full formatted address', () => {
    const line1 = '4 main st';
    const line2 = 'woodpark';
    const line3 = 'London';
    const line4 = 'England';
    const line5 = 'SW1A 1AA';

    const address = answersAddressFormatter(line1, line2, line3, line4, line5);

    expect(address).toEqual('4 main st, woodpark, London, England, SW1A 1AA');
  });

  it('should return formatted address without postcode', () => {
    const line1 = '4 main st';
    const line2 = 'woodpark';
    const line3 = 'London';
    const line4 = 'England';

    const address = answersAddressFormatter(line1, line2, line3, line4);

    expect(address).toEqual('4 main st, woodpark, London, England');
  });
  it('should return formatted address without line2', () => {
    const line1 = '4 main st';
    const line3 = 'London';
    const line4 = 'England';

    const address = answersAddressFormatter(line1, line3, line4);

    expect(address).toEqual('4 main st, London, England');
  });
});
