-- ============================================================================
-- Migrazione 0000 -- Estensioni PostgreSQL
-- ============================================================================
-- Deve essere applicata PRIMA di 0001_initial_schema.sql: le colonne
-- geography(Point,4326) di ranges.location e users.home_location richiedono
-- il tipo "geography" fornito da PostGIS, che non esiste finche' l'estensione
-- non e' installata.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;

-- Necessaria per il vincolo EXCLUDE USING GIST su bookings (Piano_Sviluppo_App.md
-- §4.3): permette di usare GIST anche su colonne non geometriche (uuid, tstzrange).
CREATE EXTENSION IF NOT EXISTS btree_gist;
