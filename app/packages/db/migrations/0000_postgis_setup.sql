-- ============================================================================
-- Migrazione 0000 — Setup PostGIS e indici specialistici
-- ============================================================================
-- Eseguita prima della migrazione Drizzle automatica.
-- Drizzle genera le CREATE TABLE dagli schemi TypeScript; qui aggiungiamo
-- ciò che Drizzle non supporta nativamente (PostGIS, EXCLUDE, viste).
-- ============================================================================

-- 1. Abilita estensioni PostgreSQL
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS btree_gist;  -- necessario per EXCLUDE con GIST

-- 2. Indici GIST per ricerca geografica (Piano §4.1)
--    Dopo che la tabella `ranges` è stata creata dalla migrazione Drizzle:
-- CREATE INDEX IF NOT EXISTS idx_ranges_location_gist
--   ON ranges USING GIST (location);

-- CREATE INDEX IF NOT EXISTS idx_ranges_provincia_status
--   ON ranges (provincia, status);

-- CREATE INDEX IF NOT EXISTS idx_ranges_verified_at
--   ON ranges (verified_at);

-- 3. Vincolo di esclusione — doppia prenotazione (Piano §4.3)
--    Dopo che la tabella `bookings` è stata creata:
-- ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlap
--   EXCLUDE USING GIST (
--     line_id WITH =,
--     tstzrange(slot_start, slot_end) WITH &&
--   ) WHERE (status IN ('richiesta', 'confermata'));

-- 4. Vista materializzata inventario munizioni (Piano §4.4)
-- CREATE MATERIALIZED VIEW IF NOT EXISTS ammo_inventory AS
-- SELECT
--   user_id,
--   caliber,
--   category,
--   SUM(delta) AS quantity
-- FROM ammo_movements
-- GROUP BY user_id, caliber, category;

-- CREATE UNIQUE INDEX IF NOT EXISTS idx_ammo_inventory
--   ON ammo_inventory (user_id, caliber, category);

-- 5. Seed dati limiti legali (Piano §4.5)
-- INSERT INTO legal_ammo_limits (category, max_quantity, declaration_from, legal_reference, note)
-- VALUES
--   ('arma_corta', 200, NULL, 'art. 97 TULPS', 'Limite cartucce per arma corta'),
--   ('arma_lunga_caccia', 1500, NULL, 'art. 97 TULPS', 'Limite cartucce a palla per arma lunga'),
--   ('spezzone', 1500, 1000, 'art. 97 TULPS', 'Obbligo denuncia oltre 1000 pezzi'),
--   ('polvere', 2000, NULL, 'art. 97 TULPS', 'Limite polvere da sparo in grammi')
-- ON CONFLICT (category) DO NOTHING;
