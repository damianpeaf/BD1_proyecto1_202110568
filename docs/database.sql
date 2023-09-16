
-- ************ Creación de modelo temporal ************

CREATE TEMPORARY TABLE IF NOT EXISTS departamento_temporal (
    id INT PRIMARY KEY,
    nombre VARCHAR (50) NOT NULL
);

CREATE TEMPORARY TABLE IF NOT EXISTS partido_politico_temporal (
    id INT PRIMARY KEY,
    nombre VARCHAR (50) NOT NULL,
    siglas VARCHAR (10) NOT NULL,
    fundacion DATE NOT NULL
);

CREATE TEMPORARY TABLE IF NOT EXISTS cargo_candidato_temporal (
    id INT PRIMARY KEY,
    cargo VARCHAR (50) NOT NULL
);

CREATE TEMPORARY TABLE IF NOT EXISTS ciudadano_temporal (
    dpi BIGINT PRIMARY KEY,
    nombre VARCHAR (50) NOT NULL,
    apellido VARCHAR (50) NOT NULL,
    direccion VARCHAR (50) NOT NULL,
    telefono BIGINT NOT NULL,
    edad INT NOT NULL,
    genero char(1) NOT NULL
);

CREATE TEMPORARY TABLE IF NOT EXISTS mesa_votacion_temporal (
    id INT PRIMARY KEY,
    departamento INT NOT NULL
);

CREATE TEMPORARY TABLE IF NOT EXISTS candidato_temporal (
    id INT PRIMARY KEY,
    nombres VARCHAR (50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    partido_politico INT,
    cargo_candidato INT
);

CREATE TEMPORARY TABLE IF NOT EXISTS voto_temporal (
    id INT PRIMARY KEY,
    dpi BIGINT NOT NULL,
    mesa_votacion INT NOT NULL,
    fecha_hora DATETIME
);

CREATE TEMPORARY TABLE IF NOT EXISTS detalle_voto_temporal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voto INT NOT NULL,
    candidato INT NOT NULL
);


-- ************ Creación de modelo persistente ************
CREATE TABLE IF NOT EXISTS departamento (
    id INT PRIMARY KEY,
    nombre VARCHAR (50) NOT NULL
);

CREATE TABLE IF NOT EXISTS partido_politico (
    id INT PRIMARY KEY,
    nombre VARCHAR (50) NOT NULL,
    siglas VARCHAR (10) NOT NULL,
    fundacion DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS cargo_candidato (
    id INT PRIMARY KEY,
    cargo VARCHAR (50) NOT NULL
);

CREATE TABLE IF NOT EXISTS ciudadano (
    dpi BIGINT PRIMARY KEY,
    nombre VARCHAR (50) NOT NULL,
    apellido VARCHAR (50) NOT NULL,
    direccion VARCHAR (50) NOT NULL,
    telefono BIGINT NOT NULL,
    edad INT NOT NULL,
    genero char(1) NOT NULL
);

CREATE TABLE IF NOT EXISTS mesa_votacion (
    id INT PRIMARY KEY,
    departamento INT NOT NULL,
    FOREIGN KEY (departamento) REFERENCES departamento(id)
);

CREATE TABLE IF NOT EXISTS candidato (
    id INT PRIMARY KEY,
    nombres VARCHAR (50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    partido_politico INT,
    cargo_candidato INT,
    FOREIGN KEY (partido_politico) REFERENCES partido_politico(id),
        FOREIGN KEY (cargo_candidato) REFERENCES cargo_candidato(id)
);

CREATE TABLE IF NOT EXISTS voto (
    id INT PRIMARY KEY,
    dpi BIGINT NOT NULL,
    mesa_votacion INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    FOREIGN KEY (dpi) REFERENCES ciudadano(dpi),
    FOREIGN KEY (mesa_votacion) REFERENCES mesa_votacion(id)
);
CREATE TABLE IF NOT EXISTS detalle_voto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voto INT NOT NULL,
    candidato INT NOT NULL,
    FOREIGN KEY (voto) REFERENCES voto(id),
    FOREIGN KEY (candidato) REFERENCES candidato(id)
);

-- ************ Consutas ************

-- Consulta 1
SELECT 
GROUP_CONCAT(CASE WHEN cargo_candidato = 1 THEN nombres END) AS "Presidente",
GROUP_CONCAT(CASE WHEN cargo_candidato = 2 THEN nombres END) AS "Vicepresidente",
p.nombre as "Partido"
FROM candidato c
inner join partido_politico p on c.partido_politico=p.id
where partido_politico <> -1
GROUP BY partido_politico;

-- Consulta 2
select p.nombre as "Partido", count(partido_politico) as "Cantidad"
from candidato c
inner join partido_politico p on c.partido_politico=p.id
where c.cargo_candidato in (3,4,5)
group by c.partido_politico;

-- Consulta 3
select p.nombre as "Partido", c.nombres as "Nombre"
from candidato c
inner join partido_politico p on c.partido_politico=p.id
where cargo_candidato=6 and partido_politico <> -1;

-- Consulta 4
select p.nombre as "Partido", count(partido_politico) as "Cantidad"
from candidato c
inner join partido_politico p on c.partido_politico=p.id
where partido_politico <> -1
group by c.partido_politico;

-- Consulta 5
select d.nombre as "Departamento", count(*) as "Cantidad_votaciones"
from voto v
inner join mesa_votacion m on v.mesa_votacion=m.id
inner join departamento d on d.id=m.departamento
group by d.nombre;

-- Consulta 6
select count(*) as "votos nulos"
from detalle_voto
where candidato=-1;

-- Consulta 7
select edad, count(*) as "cantidad"
from voto v
inner join ciudadano c on v.dpi=c.dpi
group by c.edad
order by count(*) desc
limit 10;

-- Consulta 8
select
    p.nombre as "partido",
    c.nombres as "presidente",
    (
      select c2.nombres from candidato c2 where c2.partido_politico=p.id and c2.cargo_candidato=2
    ) as "vicepresidente",
    count(*) "votos_totales"
from detalle_voto dv
inner join candidato c on c.id=dv.candidato
inner join partido_politico p on p.id=c.partido_politico
where c.cargo_candidato in (1,2)
group by c.partido_politico, c.id
order by count(*) desc
limit 10;


-- Consulta 9
select m.id as "numero_mesa", d.nombre as "depto", count(*) "cantidad_votos"
from voto v
inner join mesa_votacion m on v.mesa_votacion=m.id
inner join departamento d on d.id=m.departamento
group by m.id
order by count(*) desc
limit 5;


-- Consulta 10
select
  fecha_hora as "hora_y_minutos",
  count(*) as "no_de_votos" 
from voto
group by fecha_hora
order by no_de_votos desc
limit 5;

-- Consulta 11
select c.genero, count(*) as "cantidad_de_votos"
from voto v
inner join ciudadano c on c.dpi=v.dpi
group by c.genero;
