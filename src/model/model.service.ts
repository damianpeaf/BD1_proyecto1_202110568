import { Injectable, HttpException, Logger } from '@nestjs/common';
import {
  FileProcessingService,
  TableI,
} from 'src/file_processing/file_processing.service';
import { DataSource, QueryRunner } from 'typeorm';
import {
  createModelScript,
  createTemporaryModelScript,
  dropModelScript,
  insertCargoCandidatoScript,
  insertDepartamentosScript,
  insertPartidosPoliticosScript,
  insertCiudadanoScript,
  insertMesaVotacionScript,
  insertCandidatoScript,
  insertVotoScript,
  insertDetalleVotoScript,
  loadTemporaryIntoModelScript,
} from './scripts';

@Injectable()
export class ModelService {
  private logger = new Logger('ModelService');
  private tables: {
    [key: string]: TableI;
  } = {};
  private queryRunner: QueryRunner;

  constructor(
    private readonly dataSource: DataSource,
    private readonly fileService: FileProcessingService,
  ) {}

  private async runQuery(...args: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let currentQuery = '';
    try {
      for (const query of args) {
        currentQuery = query;
        await queryRunner.query(query);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new HttpException('Error al ejecutar una de las consultas', 400);
    } finally {
      await queryRunner.release();
    }
  }

  async eliminarTablaTemporal() {
    return true;
  }
  async cargarTablaTemporal(files: Array<Express.Multer.File>) {
    for (const file of files) {
      const data = await this.fileService.getAsTable(file);

      if (file.originalname == 'votaciones.csv') {
        this.normalizeVotaciones(data);
        continue;
      }

      this.tables[file.originalname.replace('.csv', '')] = data;
    }

    await this.runQuery(
      ...createTemporaryModelScript,
      insertDepartamentosScript(this.tables['departamentos']),
      insertPartidosPoliticosScript(this.tables['partidos']),
      insertCargoCandidatoScript(this.tables['cargos']),
      insertCiudadanoScript(this.tables['ciudadanos']),
      insertMesaVotacionScript(this.tables['mesas']),
      insertCandidatoScript(this.tables['candidatos']),
      insertVotoScript(this.tables['voto']),
      insertDetalleVotoScript(this.tables['detalle_voto']),
      ...loadTemporaryIntoModelScript,
    );

    // TODO : load data into temporary tables

    this.tables = {};
    return true;
  }
  async eliminarModelo() {
    await this.runQuery(...dropModelScript);

    return true;
  }
  async crearModelo() {
    await this.runQuery(...createModelScript);
    return true;
  }
  async cargarModelo() {
    return true;
  }

  private normalizeVotaciones(table: TableI) {
    const votoTable: TableI = {
      headers: ['id_voto', 'dpi_ciudadano', 'mesa_id', 'fecha_hora'],
      rows: [],
    };

    const registeredVotos = new Set();
    table.rows.forEach((row) => {
      if (registeredVotos.has(row[0])) {
        return;
      }
      registeredVotos.add(row[0]);
      votoTable.rows.push([row[0], row[2], row[3], row[4]]);
    });

    const detalleVotoTable: TableI = {
      headers: ['id_voto', 'id_candidato'],
      rows: [],
    };

    table.rows.forEach((row) => {
      detalleVotoTable.rows.push([row[0], row[1]]);
    });

    this.tables['voto'] = votoTable;
    this.tables['detalle_voto'] = detalleVotoTable;
  }
}
