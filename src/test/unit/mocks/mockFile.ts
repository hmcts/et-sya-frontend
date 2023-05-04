import { Readable } from 'stream';

export const mockFile = {
  fieldname: 'test',
  filename: 'test',
  encoding: 'txt',
  mimetype: 'test',
  size: 2046,
  stream: new Readable(),
  destination: '',
  originalname: 'testFile.txt',
  path: '',
  buffer: Buffer.from('test'),
};

export const mockPdf = {
  fieldname: 'test',
  filename: 'test',
  encoding: 'txt',
  mimetype: 'test',
  size: 2046,
  stream: new Readable(),
  destination: '',
  originalname: 'testFile.pdf',
  path: '',
  buffer: Buffer.from('test'),
};
