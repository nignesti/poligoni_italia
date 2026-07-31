/**
 * Orari di apertura verificati direttamente sul sito ufficiale di ciascuna
 * struttura (fetch della pagina, non aggregatori terzi tipo paginegialle/
 * oraridiapertura24 — spesso non aggiornati). Primo lotto (campione di
 * validazione del metodo, 31/07/2026): 7 strutture su 12 controllate avevano
 * una pagina orari raggiungibile e leggibile; le altre 5 (TSN Napoli, TSN
 * Firenze, TSN Catania, Conrad Shooting Club, Sport Gun Il Poligono) sono
 * escluse qui — pagina orari non raggiungibile (401/404/errore SSL) o dati
 * troppo ambigui per essere pubblicati come verificati (TSN Milano: orari
 * sportello con doppia fascia 17:15/17:30 non univoca nella pagina).
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
