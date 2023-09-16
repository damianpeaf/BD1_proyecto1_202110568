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
    const resp = await this.runQuery(querys.consulta1);
    return {
      consulta: 1,
      rows: resp.length,
      return: resp,
    };
  }

  async getDiputados() {
    const resp = await this.runQuery(querys.consulta2);
    return {
      consulta: 2,
      rows: resp.length,
      return: resp.map((r) => ({
        ...r,
        Cantidad: parseInt(r.Cantidad, 10),
      })),
    };
  }

  async getAlcaldes() {
    const resp = await this.runQuery(querys.consulta3);
    return {
      consulta: 3,
      rows: resp.length,
      return: resp,
    };
  }

  async getCandidatosPorPartido() {
    const resp = await this.runQuery(querys.consulta4);
    return {
      consulta: 4,
      rows: resp.length,
      return: resp.map((r) => ({
        ...r,
        Cantidad: parseInt(r.Cantidad, 10),
      })),
    };
  }

  async getVotosPorDepartamento() {
    const resp = await this.runQuery(querys.consulta5);
    return {
      consulta: 5,
      rows: resp.length,
      return: resp.map((r) => ({
        ...r,
        Cantidad_votaciones: parseInt(r.Cantidad_votaciones, 10),
      })),
    };
  }

  async getVotosNulos() {
    const resp = await this.runQuery(querys.consulta6);
    return {
      consulta: 6,
      return: resp,
    };
  }

  async getTop10Edades() {
    const resp = await this.runQuery(querys.consulta7);
    return {
      consulta: 7,
      return: resp.map((r, i) => ({
        edad: parseInt(r.edad, 10),
        cantidad: parseInt(r.cantidad, 10),
        puesto: i + 1,
      })),
    };
  }

  async getTop10Presidenciables() {
    const resp = await this.runQuery(querys.consulta8);
    return {
      consulta: 8,
      return: resp.map((r, i) => ({
        ...r,
        votos_totales: parseInt(r.votos_totales, 10),
        puesto: i + 1,
      })),
    };
  }

  async getTop5Mesas() {
    const resp = await this.runQuery(querys.consulta9);
    return {
      consulta: 9,
      return: resp.map((r, i) => ({
        ...r,
        cantidad_votos: parseInt(r.cantidad_votos, 10),
        puesto: i + 1,
      })),
    };
  }

  async getTop5HoraConcurrida() {
    const res = (await this.runQuery(querys.consulta10)) as [
      { hora_y_minutos: string; no_de_votos: string },
    ];

    return {
      consulta: 10,
      return: res.map((r, i) => ({
        hora_y_minutos: new Date(r.hora_y_minutos).toLocaleString(),
        no_de_votos: parseInt(r.no_de_votos, 10),
        puesto: i + 1,
      })),
    };
  }

  async getVotosPorGenero() {
    const resp = await this.runQuery(querys.consulta11);
    return {
      consulta: 11,
      return: resp.map((r) => ({
        ...r,
        cantidad_de_votos: parseInt(r.cantidad_de_votos, 10),
      })),
    };
  }
}
