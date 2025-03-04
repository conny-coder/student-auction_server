import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponse } from './file.interface';
import { v4 as uuidv4 } from 'uuid';
import { path as appPath } from 'app-root-path';

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'default',
  ): Promise<FileResponse[]> {
    const uploadFolder = `${appPath}/uploads/${folder}`;
    await ensureDir(uploadFolder);

    const res: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        const uid = uuidv4();
        const fileExt = path.extname(file.originalname);
        const fileName = `${uid}${fileExt}`;
        await writeFile(`${uploadFolder}/${fileName}`, file.buffer);
        return {
          url: `/uploads/${folder}/${fileName}`,
          name: file.originalname,
        };
      }),
    );

    return res;
  }
}
