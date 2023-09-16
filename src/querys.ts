const consulta1 = `
SELECT 
GROUP_CONCAT(CASE WHEN cargo_candidato = 1 THEN nombres END) AS "Presidente",
GROUP_CONCAT(CASE WHEN cargo_candidato = 2 THEN nombres END) AS "Vicepresidente",
p.nombre as "Partido"
FROM candidato c
inner join partido_politico p on c.partido_politico=p.id
where partido_politico <> -1
GROUP BY partido_politico;
`;

const consulta2 = `
select p.nombre as "Partido", count(partido_politico) as "Cantidad"
from candidato c
inner join partido_politico p on c.partido_politico=p.id
where c.cargo_candidato in (3,4,5)
group by c.partido_politico;
`;

const consulta3 = `
select p.nombre as "Partido", c.nombres as "Nombre"
from candidato c
inner join partido_politico p on c.partido_politico=p.id
where cargo_candidato=6 and partido_politico <> -1
;
`;

const consulta4 = `
select p.nombre as "Partido", count(partido_politico) as "Cantidad"
from candidato c
inner join partido_politico p on c.partido_politico=p.id
where partido_politico <> -1
group by c.partido_politico;
`;

const consulta5 = `
select d.nombre as "Departamento", count(*) as "Cantidad_votaciones"
from voto v
inner join mesa_votacion m on v.mesa_votacion=m.id
inner join departamento d on d.id=m.departamento
group by d.nombre
;
`;

const consulta6 = `
select count(*) as "votos nulos"
from detalle_voto
where candidato=-1
`;

const consulta7 = `
select edad, count(*) as "cantidad"
from voto v
inner join ciudadano c on v.dpi=c.dpi
group by c.edad
order by count(*) desc
limit 10
;
`;

const consulta8 = `
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
limit 10
;
`;

const consulta9 = `
select m.id as "numero_mesa", d.nombre as "depto", count(*) "cantidad_votos"
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
  fecha_hora as "hora_y_minutos",
  count(*) as "no_de_votos" 
from voto
group by fecha_hora
order by no_de_votos desc
limit 5;
`;

const consulta11 = `
select c.genero, count(*) as "cantidad_de_votos"
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
