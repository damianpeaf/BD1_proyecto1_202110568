const consulta1 = `
SELECT 
GROUP_CONCAT(CASE WHEN cargo_candidato = 1 THEN nombres END) AS "nombre_presidente",
GROUP_CONCAT(CASE WHEN cargo_candidato = 2 THEN nombres END) AS "nombre_vicepresidente",
p.nombre as "partido"
FROM candidato c
inner join partido_politico p on c.partido_politico=p.id
where partido_politico <> -1
GROUP BY partido_politico;
`;

const consulta2 = `
select p.nombre as "partido", count(partido_politico) as "diputados"
from candidato c
inner join partido_politico p on c.partido_politico=p.id
where c.cargo_candidato in (3,4,5)
group by c.partido_politico;
`;

const consulta3 = `
select p.nombre as "partido", c.nombres as "alcalde"
from candidato c
inner join partido_politico p on c.partido_politico=p.id
where cargo_candidato=6 and partido_politico <> -1
;
`;

const consulta4 = `
select p.nombre as "partido", count(partido_politico) as "candidatos"
from candidato c
inner join partido_politico p on c.partido_politico=p.id
where partido_politico <> -1
group by c.partido_politico;
`;

const consulta5 = `
select d.nombre, count(*) as "votos"
from voto v
inner join mesa_votacion m on v.mesa_votacion=m.id
inner join departamento d on d.id=m.departamento
group by d.nombre
;
`;

const consulta6 = `
select count(*) as "votos nulos"
from detalle_voto
where candidato=-1;
`;

const consulta7 = `
select edad, count(*) as "votos realizados"
from voto v
inner join ciudadano c on v.dpi=c.dpi
group by c.edad
order by count(*) desc
limit 10
;
`;

const consulta8 = `
select p.nombre as "partido", c.nombres as "candidato", count(*) 'votos'
from detalle_voto dv
inner join candidato c on c.id=dv.candidato
inner join partido_politico p on p.id=c.partido_politico
where c.cargo_candidato in (1,2)
group by c.partido_politico, c.id
order by count(*) desc
limit 10
;
`;

const consulta9 = `
select m.id as "mesa", d.nombre, count(*) "votosemitidos"
from voto v
inner join mesa_votacion m on v.mesa_votacion=m.id
inner join departamento d on d.id=m.departamento
group by m.id
order by count(*) desc
limit 5
;
`;

const consulta10 = `
select
  hour(fecha_hora) as hora,
  count(*) as cantidad_votos
from voto
group by hora
order by cantidad_votos desc
limit 5;
`;

const consulta11 = `
select c.genero, count(*) as "votos"
from voto v
inner join ciudadano c on c.dpi=v.dpi
group by c.genero
;
`;

export const querys = {
  consulta1,
  consulta2,
  consulta3,
  consulta4,
  consulta5,
  consulta6,
  consulta7,
  consulta8,
  consulta9,
  consulta10,
  consulta11,
};
