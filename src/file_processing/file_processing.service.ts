import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as csvParser from 'csv-parser';

export interface TableI {
  headers: string[];
  rows: string[][];
}

@Injectable()
export class FileProcessingService {
  async getAsTable(file: Express.Multer.File): Promise<TableI> {
    const results = await this.parseCSV(file);

    // convert the results to a table

    const headers = this.sanitize(Object.keys(results[0]));
    const rows = results.map((record) => this.sanitize(Object.values(record)));

    return {
      headers,
      rows,
    };
  }

  private async parseCSV(file: Express.Multer.File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      // Crea un stream de lectura desde el archivo CSV
      const stream = Readable.from(file.buffer);

      // Utiliza csv-parser para analizar el contenido del archivo CSV
      stream
        .pipe(csvParser())
        .on('data', (row) => results.push(row))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  private sanitize(record: string[]): string[] {
    const partial = record.map((value) => {
      let sanitized = value.trim();
      sanitized = sanitized.replace(/"/g, '');
      sanitized = sanitized.replace(/'/g, '');
      return sanitized;
    });
    // if partial contains '' remove it
    const index = partial.indexOf('');
    if (index > -1) {
      partial.splice(index, 1);
    }
    return partial;
  }
}
