import { HttpException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { querys } from './querys';

@Injectable()
export class AppService {
  private logger = new Logger('AppService');
  constructor(private readonly dataSource: DataSource) {}

  private async runQuery(q: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let result = null;

    try {
      result = await queryRunner.query(q);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new HttpException('Error al ejecutar una de las consultas', 400);
    } finally {
      await queryRunner.release();
    }

    if (Array.isArray(result) && result.length === 1) {
      return result[0];
    }

    return result;
  }

  async getPresidenciables() {
    return this.runQuery(querys.consulta1);
  }

  async getDiputados() {
    return this.runQuery(querys.consulta2);
  }

  async getAlcaldes() {
    return this.runQuery(querys.consulta3);
  }

  async getCandidatosPorPartido() {
    return this.runQuery(querys.consulta4);
  }

  async getVotosPorDepartamento() {
    return this.runQuery(querys.consulta5);
  }

  async getVotosNulos() {
    return this.runQuery(querys.consulta6);
  }

  async getTop10Edades() {
    return this.runQuery(querys.consulta7);
  }

  async getTop10Presidenciables() {
    return this.runQuery(querys.consulta8);
  }

  async getTop5Mesas() {
    return this.runQuery(querys.consulta9);
  }

  async getTop5HoraConcurrida() {
    return this.runQuery(querys.consulta10);
  }

  async getVotosPorGenero() {
    return this.runQuery(querys.consulta11);
  }
}
