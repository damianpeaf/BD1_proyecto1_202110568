import { Injectable, HttpException, Logger } from '@nestjs/common';
import {
  FileProcessingService,
  TableI,
} from 'src/file_processing/file_processing.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ModelService {
  private logger = new Logger('ModelService');
  private tables: {
    [key: string]: TableI;
  } = {};

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
      this.logger.error(error + ' ' + currentQuery);
      throw new HttpException('Error al ejecutar una de las consultas', 400);
    } finally {
      await queryRunner.release();
    }
  }

  async eliminarTablaTemporal() {
    this.tables = {};
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

    console.log({
      voto: this.tables['voto'].rows[0],
      detalle: this.tables['detalle_voto'].rows[1],
    });
    return true;
  }
  async eliminarModelo() {
    await this.runQuery(
      `DROP TABLE IF EXISTS detalle_voto;`,
      `DROP TABLE IF EXISTS voto;`,
      `DROP TABLE IF EXISTS candidato;`,
      `DROP TABLE IF EXISTS mesa_votacion;`,
      `DROP TABLE IF EXISTS ciudadano;`,
      `DROP TABLE IF EXISTS cargo_candidato;`,
      `DROP TABLE IF EXISTS partido_politico;`,
      `DROP TABLE IF EXISTS departamento;`,
    );

    return true;
  }
  async crearModelo() {
    // mysql query
    await this.runQuery(
      `
      CREATE TABLE IF NOT EXISTS departamento (
        id INT PRIMARY KEY,
        nombre VARCHAR (50) NOT NULL
      );`,

      `
      CREATE TABLE IF NOT EXISTS partido_politico (
        id INT PRIMARY KEY,
        nombre VARCHAR (50) NOT NULL,
        siglas VARCHAR (10) NOT NULL,
        fundacion DATE NOT NULL
      );`,
      `
      CREATE TABLE IF NOT EXISTS cargo_candidato (
        id INT PRIMARY KEY,
        cargo VARCHAR (50) NOT NULL
      );
      `,
      `
      CREATE TABLE IF NOT EXISTS ciudadano (
        dpi INT PRIMARY KEY,
        nombre VARCHAR (50) NOT NULL,
        apellido VARCHAR (50) NOT NULL,
        direccion VARCHAR (50) NOT NULL,
        departamento INT NOT NULL,
        edad INT NOT NULL,
        genero char(1) NOT NULL
      );`,
      `
      CREATE TABLE IF NOT EXISTS mesa_votacion (
        id INT PRIMARY KEY,
        departamento INT NOT NULL,
        FOREIGN KEY (departamento) REFERENCES departamento(id)
      );`,
      `
      CREATE TABLE IF NOT EXISTS candidato (
        id INT PRIMARY KEY,
        nombres VARCHAR (50) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        partido_politico INT,
        cargo_candidato INT,
        FOREIGN KEY (partido_politico) REFERENCES partido_politico(id),
        FOREIGN KEY (cargo_candidato) REFERENCES cargo_candidato(id)
      );`,
      `
      CREATE TABLE IF NOT EXISTS voto (
        id INT PRIMARY KEY,
        dpi INT NOT NULL,
        mesa_votacion INT NOT NULL,
        fecha DATE NOT NULL,
        FOREIGN KEY (dpi) REFERENCES ciudadano(dpi),
        FOREIGN KEY (mesa_votacion) REFERENCES mesa_votacion(id)
      );`,
      `
      CREATE TABLE IF NOT EXISTS detalle_voto (
        id INT PRIMARY KEY AUTO_INCREMENT,
        voto INT NOT NULL,
        candidato INT NOT NULL,
        FOREIGN KEY (voto) REFERENCES voto(id),
        FOREIGN KEY (candidato) REFERENCES candidato(id)
      );
    `,
    );
    return true;
  }
  async cargarModelo() {
    await this.cargarDepartamentos();

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

  private async cargarDepartamentos() {
    if (!this.tables['departamentos'])
      throw new HttpException('No se ha cargado la tabla departamentos', 400);

    try {
      await this.runQuery(`
      INSERT INTO departamento (id, nombre) VALUES ${this.tables[
        'departamentos'
      ].rows
        .map((row) => `(${row[0]}, '${row[1]}')`)
        .join(', ')}
    `);
    } catch (error) {
      throw new HttpException("Error al cargar la tabla 'departamentos'", 400);
    }
  }
}
