/**
 * Helper Drizzle per tipi PostGIS.
 *
 * PostgreSQL 15+ con estensione PostGIS. Il tipo Geography(Point,4326) permette
 * query geospaziali (ricerca per raggio) e usa coordinate WGS84 (lat/lng).
 *
 * Piano_Sviluppo_App.md §4.
 */
import { customType } from 'drizzle-orm/pg-core';

/**
 * Colonna Geography(Point,4326) — coordinate WGS84.
 *
 * In SQL: `location geography(Point,4326)`
 *
 * In TypeScript: si usa un oggetto `{ lat: number; lng: number }`.
 * Drizzle non supporta nativamente PostGIS: usiamo customType per serializzare
 * in formato WKT (Well-Known Text) e deserializzare con ST_AsGeoJSON.
 */
export const geographyPoint = customType<{
  data: { lat: number; lng: number };
  driverParam: string;
  notNull: true;
  default: false;
}>({
  dataType() {
    return 'geography(Point,4326)';
  },
  toDriver(value: { lat: number; lng: number }): string {
    return `POINT(${value.lng} ${value.lat})`;
  },
  fromDriver(value: unknown): { lat: number; lng: number } {
    if (typeof value === 'string') {
      // WKT format: "POINT(lng lat)"
      const match = /POINT\(([\d.-]+)\s([\d.-]+)\)/i.exec(value);
      if (match) {
        return { lat: parseFloat(match[2]!), lng: parseFloat(match[1]!) };
      }
    }
    if (typeof value === 'object' && value !== null) {
      // GeoJSON format: {"type":"Point","coordinates":[lng,lat]}
      const obj = value as Record<string, unknown>;
      if (obj.type === 'Point' && Array.isArray(obj.coordinates)) {
        return { lat: obj.coordinates[1] as number, lng: obj.coordinates[0] as number };
      }
    }
    return { lat: 0, lng: 0 };
  },
});

/**
 * Helper per creare un indice GIST su una colonna geography.
 * Da usare nelle migrazioni manuali per colonne PostGIS.
 */
export const gistIndex = (columnName: string) =>
  `CREATE INDEX IF NOT EXISTS idx_${columnName}_gist ON ${columnName} USING GIST (${columnName});`;

/**
 * Helper per il vincolo di esclusione (usato da bookings — Piano §4.3).
 */
export const noOverlapConstraint = (
  tableName: string,
  lineIdCol: string,
  rangeCol: string,
) =>
  `ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_no_overlap EXCLUDE USING GIST (
    ${lineIdCol} WITH =,
    ${rangeCol} WITH &&
  ) WHERE (status IN ('richiesta','confermata'));`;

// ---------------------------------------------------------------------------
// Timestamps di default
// ---------------------------------------------------------------------------
import { sql } from 'drizzle-orm';

/** now() con fuso orario — per created_at / updated_at. */
export const timestamptz = (name: string) =>
  sql`${sql.identifier(name)} timestamptz not null default now()`;

/** now() senza fuso — per date pure. */
export const timestamp = (name: string) =>
  sql`${sql.identifier(name)} timestamp not null default now()`;
