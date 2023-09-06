import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  async getFiles() {
    // get files from the root -> /files
    const files = await fs.promises.readdir('files');

    console.log({
      files,
    });
  }
}
