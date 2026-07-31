/**
 * Orari di apertura verificati direttamente sul sito ufficiale di ciascuna
 * struttura (fetch della pagina, non aggregatori terzi tipo paginegialle/
 * oraridiapertura24 — spesso non aggiornati), più TSN Milano e TSN Napoli
 * confermati manualmente dall'utente col testo pubblicato sui rispettivi
 * siti. Primo lotto (campione di validazione del metodo, 31/07/2026): 9
 * strutture su 12 hanno orari verificati; le altre 3 (TSN Firenze, TSN
 * Catania, Conrad Shooting Club) restano escluse — pagina orari non
 * raggiungibile (401/404/errore SSL).
 *
 * weekday: 0=Domenica … 6=Sabato (stessa convenzione di Date.getDay() e di
 * packages/db/src/queries/ranges.ts).
 */
import { slugify } from '@poligoni/core/slug';

export interface HoursRow {
  slug: string;
  weekday: number;
  opensAt: string;
  closesAt: string;
}

export const HOURS_ROWS: HoursRow[] = [
  // TSN Milano — sportelli noleggi e cartucce (tsnmilano.it), confermato
  // dall'utente sulla base del testo pubblicato sul sito. Chiusura
  // pomeridiana indicata come "17:15/17:30" senza distinzione per giorno:
  // uso 17:30 (fascia estesa, coerente con la stagione estiva corrente).
  { slug: slugify('TSN Milano'), weekday: 2, opensAt: '08:45', closesAt: '12:15' },
  { slug: slugify('TSN Milano'), weekday: 2, opensAt: '14:00', closesAt: '17:30' },
  { slug: slugify('TSN Milano'), weekday: 4, opensAt: '08:45', closesAt: '12:15' },
  { slug: slugify('TSN Milano'), weekday: 4, opensAt: '14:00', closesAt: '17:30' },
  { slug: slugify('TSN Milano'), weekday: 5, opensAt: '08:45', closesAt: '12:15' },
  { slug: slugify('TSN Milano'), weekday: 5, opensAt: '14:00', closesAt: '17:30' },
  { slug: slugify('TSN Milano'), weekday: 6, opensAt: '08:45', closesAt: '12:15' },
  { slug: slugify('TSN Milano'), weekday: 6, opensAt: '14:00', closesAt: '17:30' },
  { slug: slugify('TSN Milano'), weekday: 0, opensAt: '08:45', closesAt: '12:15' },
  { slug: slugify('TSN Milano'), weekday: 0, opensAt: '14:00', closesAt: '17:30' },

  // TSN Napoli — poligoni 10/25/50m, confermato dall'utente sulla base del
  // testo pubblicato sul sito (tsnnapoli.it). "Festivi" non codificabile
  // con weekday fisso, escluso.
  { slug: slugify('TSN Napoli'), weekday: 2, opensAt: '09:00', closesAt: '13:30' },
  { slug: slugify('TSN Napoli'), weekday: 3, opensAt: '09:00', closesAt: '13:30' },
  { slug: slugify('TSN Napoli'), weekday: 4, opensAt: '09:00', closesAt: '13:30' },
  { slug: slugify('TSN Napoli'), weekday: 5, opensAt: '09:00', closesAt: '13:30' },
  { slug: slugify('TSN Napoli'), weekday: 6, opensAt: '09:00', closesAt: '16:30' },
  { slug: slugify('TSN Napoli'), weekday: 0, opensAt: '09:00', closesAt: '12:30' },

  // TSN Roma — impianti 10m/25m (tsnroma.it/struttura/orari)
  { slug: slugify('TSN Roma'), weekday: 2, opensAt: '09:00', closesAt: '17:00' },
  { slug: slugify('TSN Roma'), weekday: 3, opensAt: '09:00', closesAt: '17:00' },
  { slug: slugify('TSN Roma'), weekday: 4, opensAt: '09:00', closesAt: '17:00' },
  { slug: slugify('TSN Roma'), weekday: 5, opensAt: '09:00', closesAt: '17:00' },
  { slug: slugify('TSN Roma'), weekday: 6, opensAt: '09:00', closesAt: '17:00' },
  { slug: slugify('TSN Roma'), weekday: 0, opensAt: '09:00', closesAt: '13:00' },

  // TSN Torino — impianti per i soci (tsntorino.it/orari-di-apertura)
  { slug: slugify('TSN Torino'), weekday: 4, opensAt: '14:00', closesAt: '17:00' },
  { slug: slugify('TSN Torino'), weekday: 6, opensAt: '14:00', closesAt: '17:00' },
  { slug: slugify('TSN Torino'), weekday: 0, opensAt: '09:00', closesAt: '12:00' },
  { slug: slugify('TSN Torino'), weekday: 0, opensAt: '14:00', closesAt: '17:00' },

  // TSN Perugia (tsn-perugia.it)
  { slug: slugify('TSN Perugia'), weekday: 2, opensAt: '15:00', closesAt: '18:00' },
  { slug: slugify('TSN Perugia'), weekday: 4, opensAt: '15:00', closesAt: '18:00' },
  { slug: slugify('TSN Perugia'), weekday: 6, opensAt: '15:00', closesAt: '18:00' },
  { slug: slugify('TSN Perugia'), weekday: 0, opensAt: '09:30', closesAt: '12:30' },

  // Poligono Orobico BG ASD (poligonoorobico.com/orari-apertura.html)
  // Lun/Mar/Mer "solo su prenotazione" esclusi: non sono orari di apertura standard.
  { slug: slugify('Poligono Orobico BG ASD'), weekday: 4, opensAt: '18:00', closesAt: '22:00' },
  { slug: slugify('Poligono Orobico BG ASD'), weekday: 5, opensAt: '18:00', closesAt: '22:00' },
  { slug: slugify('Poligono Orobico BG ASD'), weekday: 6, opensAt: '09:00', closesAt: '17:00' },
  { slug: slugify('Poligono Orobico BG ASD'), weekday: 0, opensAt: '09:00', closesAt: '17:00' },

  // Trap Concaverde — orario estivo, "tutti i giorni" (trapconcaverde.it/contatti.php)
  { slug: slugify('Trap Concaverde'), weekday: 0, opensAt: '09:00', closesAt: '18:30' },
  { slug: slugify('Trap Concaverde'), weekday: 1, opensAt: '09:00', closesAt: '18:30' },
  { slug: slugify('Trap Concaverde'), weekday: 2, opensAt: '09:00', closesAt: '18:30' },
  { slug: slugify('Trap Concaverde'), weekday: 3, opensAt: '09:00', closesAt: '18:30' },
  { slug: slugify('Trap Concaverde'), weekday: 4, opensAt: '09:00', closesAt: '18:30' },
  { slug: slugify('Trap Concaverde'), weekday: 5, opensAt: '09:00', closesAt: '18:30' },
  { slug: slugify('Trap Concaverde'), weekday: 6, opensAt: '09:00', closesAt: '18:30' },

  // La Folce Poligoni di Tiro — orario pubblicato (poligonilafolce.it/wp/orario/)
  { slug: slugify('La Folce Poligoni di Tiro'), weekday: 3, opensAt: '09:00', closesAt: '18:00' },
  { slug: slugify('La Folce Poligoni di Tiro'), weekday: 5, opensAt: '09:00', closesAt: '18:00' },
  { slug: slugify('La Folce Poligoni di Tiro'), weekday: 6, opensAt: '09:00', closesAt: '18:00' },
  { slug: slugify('La Folce Poligoni di Tiro'), weekday: 0, opensAt: '09:00', closesAt: '13:00' },
];
