import { combineDocuments, combineUserCaseDocuments } from '../../../../main/controllers/helpers/DocumentHelpers';
import mockUserCaseWithDocumentsComplete from '../../mocks/mockUserCaseWithDocumentsComplete';

it('should combine documents correctly', () => {
  expect(
    combineDocuments(
      [
        { id: '1', description: 'desc1' },
        { id: '2', description: 'desc2' },
      ],
      [{ id: '3', description: 'desc3' }],
      [undefined],
      undefined
    )
  ).toStrictEqual([
    { id: '1', description: 'desc1' },
    { id: '2', description: 'desc2' },
    { id: '3', description: 'desc3' },
  ]);
});

it('should combine user case documents correctly', () => {
  expect(combineUserCaseDocuments([mockUserCaseWithDocumentsComplete])).toStrictEqual([
    { description: 'Case Details - Sunday Ayeni', id: '3aa7dfc1-378b-4fa8-9a17-89126fae5673', type: 'ET1' },
    { id: '1', description: 'desc1' },
    { id: '2', description: 'desc2' },
    { id: '3', description: 'desc3' },
    { id: '4', description: 'desc4' },
    { id: '5', description: 'desc5' },
    { id: '6', description: 'desc6' },
    { id: '7', description: 'desc7' },
    { id: '8', description: 'desc8' },
  ]);
});
