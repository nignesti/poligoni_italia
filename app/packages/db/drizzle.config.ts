import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://localhost:5432/poligoni_dev',
  },
  // Le estensioni PostGIS devono essere installate prima delle migrazioni.
  extensionsFilters: ['postgis'],
  verbose: true,
  strict: true,
});
