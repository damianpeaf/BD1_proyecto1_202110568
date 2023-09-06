import { TableI } from 'src/file_processing/file_processing.service';

export const dropModelScript = [
  `DROP TABLE IF EXISTS detalle_voto;`,
  `DROP TABLE IF EXISTS voto;`,
  `DROP TABLE IF EXISTS candidato;`,
  `DROP TABLE IF EXISTS mesa_votacion;`,
  `DROP TABLE IF EXISTS ciudadano;`,
  `DROP TABLE IF EXISTS cargo_candidato;`,
  `DROP TABLE IF EXISTS partido_politico;`,
  `DROP TABLE IF EXISTS departamento;`,
];

export const createModelScript = [
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
        dpi BIGINT PRIMARY KEY,
        nombre VARCHAR (50) NOT NULL,
        apellido VARCHAR (50) NOT NULL,
        direccion VARCHAR (50) NOT NULL,
        telefono BIGINT NOT NULL,
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
        dpi BIGINT NOT NULL,
        mesa_votacion INT NOT NULL,
        fecha_hora DATETIME NOT NULL,
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
];

export const dropTemporaryModelScript = [
  `DROP TEMPORARY TABLE IF EXISTS detalle_voto_temporal;`,
  `DROP TEMPORARY TABLE IF EXISTS voto_temporal;`,
  `DROP TEMPORARY TABLE IF EXISTS candidato_temporal;`,
  `DROP TEMPORARY TABLE IF EXISTS mesa_votacion_temporal;`,
  `DROP TEMPORARY TABLE IF EXISTS ciudadano_temporal;`,
  `DROP TEMPORARY TABLE IF EXISTS cargo_candidato_temporal;`,
  `DROP TEMPORARY TABLE IF EXISTS partido_politico_temporal;`,
  `DROP TEMPORARY TABLE IF EXISTS departamento_temporal;`,
];

export const createTemporaryModelScript = [
  `
        CREATE TEMPORARY TABLE IF NOT EXISTS departamento_temporal (
          id INT PRIMARY KEY,
          nombre VARCHAR (50) NOT NULL
        );`,

  `
        CREATE TEMPORARY TABLE IF NOT EXISTS partido_politico_temporal (
          id INT PRIMARY KEY,
          nombre VARCHAR (50) NOT NULL,
          siglas VARCHAR (10) NOT NULL,
          fundacion DATE NOT NULL
        );`,
  `
        CREATE TEMPORARY TABLE IF NOT EXISTS cargo_candidato_temporal (
          id INT PRIMARY KEY,
          cargo VARCHAR (50) NOT NULL
        );
        `,
  `
        CREATE TEMPORARY TABLE IF NOT EXISTS ciudadano_temporal (
          dpi BIGINT PRIMARY KEY,
          nombre VARCHAR (50) NOT NULL,
          apellido VARCHAR (50) NOT NULL,
          direccion VARCHAR (50) NOT NULL,
          telefono BIGINT NOT NULL,
          edad INT NOT NULL,
          genero char(1) NOT NULL
        );`,
  `
        CREATE TEMPORARY TABLE IF NOT EXISTS mesa_votacion_temporal (
          id INT PRIMARY KEY,
          departamento INT NOT NULL
        );`,
  `
        CREATE TEMPORARY TABLE IF NOT EXISTS candidato_temporal (
          id INT PRIMARY KEY,
          nombres VARCHAR (50) NOT NULL,
          fecha_nacimiento DATE NOT NULL,
          partido_politico INT,
          cargo_candidato INT
        );`,
  `
        CREATE TEMPORARY TABLE IF NOT EXISTS voto_temporal (
          id INT PRIMARY KEY,
          dpi BIGINT NOT NULL,
          mesa_votacion INT NOT NULL,
          fecha_hora DATETIME
        );`,
  `
        CREATE TEMPORARY TABLE IF NOT EXISTS detalle_voto_temporal (
          id INT PRIMARY KEY AUTO_INCREMENT,
          voto INT NOT NULL,
          candidato INT NOT NULL
        );
      `,
];

export const insertDepartamentosScript = (table: TableI) =>
  `
    INSERT INTO departamento_temporal (id, nombre) VALUES 
    ${table.rows.map((row) => `(${row[0]}, '${row[1]}')`).join(', ')}
  `;

export const insertPartidosPoliticosScript = (table: TableI) =>
  `
    INSERT INTO partido_politico_temporal (id, nombre, siglas, fundacion) VALUES 
    ${table.rows
      .map(
        (row) =>
          `(${row[0]}, '${row[1]}', '${row[2]}', '${row[3]
            .split('/')
            .reverse()
            .join('-')}')`,
      )
      .join(', ')}
  `;

export const insertCargoCandidatoScript = (table: TableI) =>
  `
      INSERT INTO cargo_candidato_temporal (id, cargo) VALUES 
      ${table.rows.map((row) => `(${row[0]}, '${row[1]}')`).join(', ')}
  `;

export const insertCiudadanoScript = (table: TableI) =>
  `
      INSERT INTO ciudadano_temporal (dpi, nombre, apellido, direccion, telefono, edad, genero) VALUES 
      ${table.rows
        .map(
          (row) =>
            `(${row[0]}, '${row[1]}', '${row[2]}', '${row[3]}', ${row[4]}, ${row[5]}, '${row[6]}')`,
        )
        .join(', ')}
  `;

export const insertMesaVotacionScript = (table: TableI) =>
  `
      INSERT INTO mesa_votacion_temporal (id, departamento) VALUES 
      ${table.rows.map((row) => `(${row[0]}, ${row[1]})`).join(', ')}
  `;

export const insertCandidatoScript = (table: TableI) =>
  `
      INSERT INTO candidato_temporal (id, nombres, fecha_nacimiento, partido_politico, cargo_candidato) VALUES 
      ${table.rows
        .map(
          (row) =>
            `(${row[0]}, '${row[1]}', '${row[2]
              .split('/')
              .reverse()
              .join('-')}', ${row[3]}, ${row[4]})`,
        )
        .join(', ')}
  `;

export const insertVotoScript = (table: TableI) =>
  `
      INSERT INTO voto_temporal (id, dpi, mesa_votacion, fecha_hora) VALUES 
      ${table.rows
        .map(
          (row) =>
            `(${row[0]}, ${row[1]}, ${row[2]}, '${
              row[3].split(' ')[0].split('/').reverse().join('-') +
              ' ' +
              row[3].split(' ')[1]
            }')`,
        )
        .join(', ')}
  `;

export const insertDetalleVotoScript = (table: TableI) =>
  `
      INSERT INTO detalle_voto_temporal (voto, candidato) VALUES 
      ${table.rows.map((row) => `(${row[0]}, ${row[1]})`).join(', ')}
  `;

export const loadTemporaryIntoModelScript = [
  `
    INSERT INTO departamento (id, nombre) SELECT id, nombre FROM departamento_temporal;
  `,
  `
    INSERT INTO partido_politico (id, nombre, siglas, fundacion) SELECT id, nombre, siglas, fundacion FROM partido_politico_temporal;
  `,
  `
    INSERT INTO cargo_candidato (id, cargo) SELECT id, cargo FROM cargo_candidato_temporal;
  `,
  `
    INSERT INTO ciudadano (dpi, nombre, apellido, direccion, telefono, edad, genero) SELECT dpi, nombre, apellido, direccion, telefono, edad, genero FROM ciudadano_temporal;
  `,
  `
    INSERT INTO mesa_votacion (id, departamento) SELECT id, departamento FROM mesa_votacion_temporal;
  `,
  `
    INSERT INTO candidato (id, nombres, fecha_nacimiento, partido_politico, cargo_candidato) SELECT id, nombres, fecha_nacimiento, partido_politico, cargo_candidato FROM candidato_temporal;
  `,
  `
    INSERT INTO voto (id, dpi, mesa_votacion, fecha_hora) SELECT id, dpi, mesa_votacion, fecha_hora FROM voto_temporal;
  `,
  `
    INSERT INTO detalle_voto (voto, candidato) SELECT voto, candidato FROM detalle_voto_temporal;
  `,
];
