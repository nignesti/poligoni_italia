-- Vista di sola lettura per consumo pubblico via PostgREST/supabase-js.
--
-- ranges.location è un geography(Point,4326): PostgREST lo serializza in
-- formato binario (WKB) non direttamente utilizzabile lato client. Questa
-- vista espone lat/lng come numeri semplici ed esclude le strutture
-- 'inattivo', rispecchiando il filtro già applicato da
-- packages/db/src/queries/ranges.ts (listRangeSummaries/findRangeBySlug)
-- per il sito.
CREATE OR REPLACE VIEW ranges_public AS
SELECT
  id,
  slug,
  name,
  type,
  address,
  comune,
  provincia,
  regione,
  cap,
  ST_Y(location::geometry) AS lat,
  ST_X(location::geometry) AS lng,
  phone,
  email,
  website,
  external_booking_url,
  status
FROM ranges
WHERE status <> 'inattivo';
