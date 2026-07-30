/**
 * Dominio utenti e documenti (Piano_Sviluppo_App.md §4.2).
 *
 * Nota: l'autenticazione primaria è gestita da Supabase Auth.
 * Questa tabella contiene i profili e i dati applicativi complementari.
 */
import { pgTable, uuid, text, pgEnum, date, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { geographyPoint } from './helpers.js';

export const userRole = pgEnum('user_role', [
  'tiratore',
  'gestore',
  'gpg',
  'admin',
]);

export const documentType = pgEnum('document_type', [
  'porto_armi_tav',
  'porto_armi_caccia',
  'porto_armi_difesa',
  'porto_gpg',
  'certificato_medico',
  'tessera_federale',
]);

/**
 * Profili utente (allineati con Supabase Auth tramite user_id).
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email'),
  phone: text('phone'),
  displayName: text('display_name'),
  role: userRole('role').notNull().default('tiratore'),
  homeLocation: geographyPoint('home_location'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Documenti scadenziali.
 *
 * Caso base (raccomandato): solo `expiresOn`, nessun file.
 * Caso esteso (facoltativo): l'utente sceglie di caricare l'immagine,
 * cifrata lato client con AES-GCM (Piano §8.2).
 */
export const userDocuments = pgTable('user_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: documentType('type').notNull(),
  expiresOn: date('expires_on').notNull(),
  storageRef: text('storage_ref'),
  encrypted: text('encrypted').notNull().default('false'),
}, (table) => ({
  userDocIdx: uniqueIndex('idx_user_documents').on(table.userId, table.type),
}));
