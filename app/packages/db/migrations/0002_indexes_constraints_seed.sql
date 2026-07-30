-- ============================================================================
-- Migrazione 0002 -- Indici specialistici, vincoli e dati di riferimento
-- ============================================================================
-- Applicata DOPO 0001_initial_schema.sql: qui sotto tutto cio' che Drizzle
-- non genera automaticamente (indici GIST, EXCLUDE, viste materializzate) e
-- che quindi va scritto a mano (Piano_Sviluppo_App.md §4).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Indici geografici e di consultazione frequente (ranges.ts, righe 6-10)
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_ranges_location_gist
  ON ranges USING GIST (location);

CREATE INDEX IF NOT EXISTS idx_ranges_provincia_status
  ON ranges (provincia, status);

CREATE INDEX IF NOT EXISTS idx_ranges_verified_at
  ON ranges (verified_at);

-- ----------------------------------------------------------------------------
-- 2. Vincolo di non sovrapposizione -- il punto piu' importante dello schema
-- ----------------------------------------------------------------------------
-- Rende la doppia prenotazione impossibile a livello di database, non solo
-- improbabile a livello applicativo (Piano §4.3, rischio 6 del business
-- plan: doppio binario online/telefono). Richiede btree_gist (migrazione 0000).
ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING GIST (
    line_id WITH =,
    tstzrange(slot_start, slot_end) WITH &&
  ) WHERE (status IN ('richiesta', 'confermata'));

-- ----------------------------------------------------------------------------
-- 3. Vista materializzata -- inventario munizioni (Piano §4.4)
-- ----------------------------------------------------------------------------
-- L'inventario e' la somma dei movimenti, non una tabella scritta
-- direttamente: se un utente contesta il conteggio su un dato con rilevanza
-- sanzionatoria, deve essere possibile ricostruire ogni variazione.
CREATE MATERIALIZED VIEW IF NOT EXISTS ammo_inventory AS
SELECT
  user_id,
  caliber,
  category,
  SUM(delta) AS quantity
FROM ammo_movements
GROUP BY user_id, caliber, category;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ammo_inventory
  ON ammo_inventory (user_id, caliber, category);

-- Da rinfrescare dopo ogni scrittura su ammo_movements:
--   REFRESH MATERIALIZED VIEW CONCURRENTLY ammo_inventory;
-- (richiede l'indice unico sopra, gia' presente)

-- ----------------------------------------------------------------------------
-- 4. Dati di riferimento -- limiti legali munizioni (Piano §4.5)
-- ----------------------------------------------------------------------------
-- Valori allineati a packages/core/src/ammo/index.ts (DEFAULT_LEGAL_LIMITS).
-- Se cambiano, aggiornare ENTRAMBI i punti: qui e il fallback TypeScript.
INSERT INTO legal_ammo_limits (category, max_quantity, declaration_from, legal_reference, note)
VALUES
  ('arma_corta', 200, NULL, 'art. 97 TULPS', 'Cartucce per arma corta: limite sulla somma di tutti i calibri, non per singolo calibro.'),
  ('arma_lunga_caccia', 1500, NULL, 'art. 97 TULPS', 'Cartucce a palla per arma lunga da caccia.'),
  ('spezzone', 1500, 1000, 'art. 97 TULPS', 'Cartucce a pallini (spezzone). Obbligo di denuncia oltre 1000 pezzi.'),
  ('polvere', 2000, NULL, 'art. 97 TULPS', 'Polvere da sparo, in grammi.')
ON CONFLICT (category) DO UPDATE SET
  max_quantity = EXCLUDED.max_quantity,
  declaration_from = EXCLUDED.declaration_from,
  legal_reference = EXCLUDED.legal_reference,
  note = EXCLUDED.note;
