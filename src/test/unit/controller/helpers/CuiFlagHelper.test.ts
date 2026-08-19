jest.mock('../../../../main/services/CuiService', () => ({
  mergeCUIFlagItems: jest.fn(),
}));

import { buildCuiFlagDetails, mergeClaimantExternalFlags } from '../../../../main/controllers/helpers/CuiFlagHelper';
import { CaseFlags } from '../../../../main/definitions/case';

const { mergeCUIFlagItems: mockMergeCUIFlagItems } = jest.requireMock('../../../../main/services/CuiService') as {
  mergeCUIFlagItems: jest.Mock;
};

describe('CuiFlagHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should normalise existing CCD flag details for CUI', () => {
    const result = buildCuiFlagDetails(
      {
        roleOnCase: 'Existing role',
        details: [
          {
            id: 'flag-id',
            value: {
              availableExternally: 'No',
              dateTimeCreated: '2026-06-23T13:33:58.833Z',
              extraField: 'not sent to CUI',
              flagCode: 'RA0018',
              flagComment: 'existing comment',
              hearingRelevant: 'Yes',
              name: 'Support filling in forms',
              name_cy: 'Cymorth i lenwi ffurflenni',
              otherDescription: 'Other support',
              path: [
                { id: 'path-id-1', name: 'Party' },
                { id: 'path-id-2', value: 'Reasonable adjustment' },
                { value: { name: 'Support' } },
                { value: { notName: 'ignored' } },
              ],
              status: 'Active',
              subTypeKey: 'documents',
            },
          },
          {
            value: {
              flagCode: 'RA0020',
              name: 'Documents in a different format',
              path: 'not an array',
            },
          },
        ],
      } as unknown as CaseFlags,
      'Jane Doe',
      'Claimant'
    );

    expect(result).toEqual({
      details: [
        {
          id: 'flag-id',
          value: {
            availableExternally: 'No',
            dateTimeCreated: '2026-06-23T13:33:58.833Z',
            flagCode: 'RA0018',
            flagComment: 'existing comment',
            hearingRelevant: 'Yes',
            name: 'Support filling in forms',
            name_cy: 'Cymorth i lenwi ffurflenni',
            otherDescription: 'Other support',
            path: [
              { id: 'path-id-1', name: 'Party' },
              { id: 'path-id-2', name: 'Reasonable adjustment' },
              { name: 'Support' },
            ],
            status: 'Active',
            subTypeKey: 'documents',
          },
        },
        {
          value: {
            availableExternally: 'Yes',
            dateTimeCreated: '',
            flagCode: 'RA0020',
            hearingRelevant: 'No',
            name: 'Documents in a different format',
            name_cy: '',
            path: [],
          },
        },
      ],
      partyName: 'Jane Doe',
      roleOnCase: 'Existing role',
    });
  });

  it('should merge replacement flags while preserving existing metadata and applying fallbacks', () => {
    const mergedDetails = [{ id: 'merged-flag' }];
    mockMergeCUIFlagItems.mockReturnValue(mergedDetails);
    const existingFlags = {
      groupId: 'group-id',
      partyName: 'Old party',
      roleOnCase: 'Existing role',
      details: [{ id: 'existing-flag' }],
    } as unknown as CaseFlags;
    const replacementFlags = {
      partyName: '',
      roleOnCase: '',
      details: [{ id: 'replacement-flag' }],
    };

    const result = mergeClaimantExternalFlags(existingFlags, replacementFlags, 'Jane Doe', 'Claimant');

    expect(mockMergeCUIFlagItems).toHaveBeenCalledWith(existingFlags.details, replacementFlags.details);
    expect(result).toEqual({
      groupId: 'group-id',
      partyName: 'Jane Doe',
      roleOnCase: 'Existing role',
      details: mergedDetails,
    });
  });
});
