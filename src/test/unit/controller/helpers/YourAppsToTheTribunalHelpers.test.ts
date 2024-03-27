import { updateStoredRedirectUrl } from '../../../../main/controllers/helpers/YourAppsToTheTribunalHelpers';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../../../main/definitions/constants';

describe('Your Apps To The Tribunal Helper', () => {
  it('should keep redirectUrl', () => {
    const genericTseApplicationType = {
      number: '1',
      status: 'Open',
      applicant: Applicant.CLAIMANT,
    } as GenericTseApplicationType;

    const item = {
      id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
      value: genericTseApplicationType,
      redirectUrl: 'original-url',
    } as GenericTseApplicationTypeItem;

    const items = [item];

    updateStoredRedirectUrl(items, 'url?lng=en');

    expect(items[0].redirectUrl).toEqual('original-url');
  });

  it('should populate redirectUrl with stored application', () => {
    const genericTseApplicationType = {
      number: '1',
      status: 'Stored',
      applicant: Applicant.CLAIMANT,
    } as GenericTseApplicationType;

    const item = {
      id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
      value: genericTseApplicationType,
      redirectUrl: 'original-url',
    } as GenericTseApplicationTypeItem;

    const items = [item];

    updateStoredRedirectUrl(items, 'url?lng=en');

    expect(items[0].redirectUrl).toEqual('/stored-to-submit/2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28?lng=en');
  });

  it('should keep redirectUrl with respond in application', () => {
    const respondCollection = {
      id: '0173ccd0-e20c-41bf-9a1c-37e97c728efc',
      value: {
        from: 'Claimant',
      },
    } as TseRespondTypeItem;

    const genericTseApplicationType = {
      number: '1',
      status: 'Open',
      applicant: Applicant.CLAIMANT,
      respondCollection: [respondCollection],
    } as GenericTseApplicationType;

    const item = {
      id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
      value: genericTseApplicationType,
      redirectUrl: 'original-url',
    } as GenericTseApplicationTypeItem;

    const items = [item];

    updateStoredRedirectUrl(items, 'url');

    expect(items[0].redirectUrl).toEqual('original-url');
  });

  it('should populate redirectUrl with stored respond in application', () => {
    const respondCollection = {
      id: '0173ccd0-e20c-41bf-9a1c-37e97c728efc',
      value: {
        from: 'Claimant',
        status: 'Stored',
      },
    } as TseRespondTypeItem;

    const genericTseApplicationType = {
      number: '1',
      status: 'Open',
      applicant: Applicant.CLAIMANT,
      respondStoredCollection: [respondCollection],
    } as GenericTseApplicationType;

    const item = {
      id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
      value: genericTseApplicationType,
      redirectUrl: 'original-url',
    } as GenericTseApplicationTypeItem;

    const items = [item];

    updateStoredRedirectUrl(items, 'url');

    expect(items[0].redirectUrl).toEqual(
      '/stored-to-submit-response/2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28/0173ccd0-e20c-41bf-9a1c-37e97c728efc?lng=en'
    );
  });
});
