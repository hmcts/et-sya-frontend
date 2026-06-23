import * as path from 'path';

import { Request, Response } from 'express';

export default class ManifestController {
  public get(req: Request, res: Response): void {
    res.setHeader('Content-Type', 'application/manifest+json');
    res.sendFile(path.join(__dirname, '../assets/manifest.json'));
  }
}
