import { Readable } from 'stream';

export const mockFile = {
  fieldname: 'test',
  originalname: 'test',
  encoding: 'txt',
  mimetype: 'test',
  size: 2046,
  stream: new Readable(),
  destination: '',
  filename: 'testFile.txt',
  path: '',
  buffer: Buffer.from('test'),
};
