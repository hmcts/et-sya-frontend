export const mockClaimantTseRequest = {
  case_id: '1234',
  case_type_id: 'ET_EnglandWales',
  type_c: true,
  claimant_tse: {
    contactApplicationType: 'witness',
    contactApplicationText: 'Change claim',
    contactApplicationFile: {
      document_url: '12345',
      document_filename: 'test.pdf',
      document_binary_url: '',
      document_size: 1000,
      document_mime_type: 'pdf',
    },
    copyToOtherPartyYesOrNo: 'No',
    copyToOtherPartyText: "Don't copy",
  },
};
