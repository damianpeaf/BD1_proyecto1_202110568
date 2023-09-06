-- 1)
SELECT p.nombre as "partido",
       GROUP_CONCAT(CASE WHEN cargo_candidato = 1 THEN nombres END) AS presidente,
       GROUP_CONCAT(CASE WHEN cargo_candidato = 2 THEN nombres END) AS vicepresidente
FROM candidato c
inner join partido_politico p on c.partido_politico=p.id
where partido_politico <> -1
GROUP BY partido_politico;

-- 2
select p.nombre as "partido", count(partido_politico) as "diputados"
from candidato c
inner join partido_politico p on c.partido_politico=p.id
where c.cargo_candidato in (3,4,5)
group by c.partido_politico;

-- ! 3) pendiente, no le caché

-- 4)
select p.nombre as "partido", count(partido_politico) as "candidatos"
from candidato c
inner join partido_politico p on c.partido_politico=p.id
where partido_politico <> -1
group by c.partido_politico;


-- 5)
select d.nombre, count(*) as "votos"
from voto v
inner join mesa_votacion m on v.mesa_votacion=m.id
inner join departamento d on d.id=m.departamento
group by d.nombre
;

-- 6)
select count(*) as "votos nulos"
from detalle_voto
where candidato=-1;

-- 7)
select edad, count(*) as "votos realizados"
from voto v
inner join ciudadano c on v.dpi=c.dpi
group by c.edad
order by count(*) desc
limit 10
;

-- 8)
select p.nombre, count(*) 'votos'
from detalle_voto dv
inner join candidato c on c.id=dv.candidato
inner join partido_politico p on p.id=c.partido_politico
where c.cargo_candidato in (1,2)
group by c.partido_politico
order by count(*) desc
limit 10
;

-- 9)
select m.id as "mesa", d.nombre, count(*) "votosemitidos"
from voto v
inner join mesa_votacion m on v.mesa_votacion=m.id
inner join departamento d on d.id=m.departamento
group by m.id
order by count(*) desc
limit 5
;

-- 10)
SELECT
  HOUR(fecha_hora) AS hora,
  COUNT(*) AS cantidad_votos
FROM voto
GROUP BY hora
ORDER BY cantidad_votos DESC
LIMIT 5;

-- 11)
select c.genero, count(*)
from voto v
inner join ciudadano c on c.dpi=v.dpi
group by c.genero
;