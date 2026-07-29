/**
 * Disponibilità e sovrapposizioni delle prenotazioni.
 *
 * ⚠️  Questo modulo NON è la difesa contro la doppia prenotazione.
 * La difesa è il vincolo di esclusione sul database (Piano_Sviluppo_App.md §4.3),
 * che rende la sovrapposizione impossibile invece che improbabile. Le funzioni qui
 * servono a mostrare all'utente ciò che è libero e a fallire presto con un
 * messaggio comprensibile — non a garantire l'integrità.
 *
 * Rischio 6 del business plan (doppio binario online/telefono): le prenotazioni
 * inserite a mano dal gestore passano dallo stesso vincolo e dagli stessi calcoli.
 */

export interface TimeRange {
  readonly start: Date;
  readonly end: Date;
}

export interface Slot extends TimeRange {
  readonly available: boolean;
}

export interface OpeningHours {
  /** Minuti dalla mezzanotte, ora locale della struttura. */
  readonly opensAtMinutes: number;
  readonly closesAtMinutes: number;
}

/** Sovrapposizione fra due intervalli. Il contatto agli estremi non è sovrapposizione. */
export function detectOverlap(a: TimeRange, b: TimeRange): boolean {
  return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime();
}

export function overlapsAny(
  candidate: TimeRange,
  existing: readonly TimeRange[],
): boolean {
  return existing.some((e) => detectOverlap(candidate, e));
}

/**
 * Genera gli slot di una giornata a partire dagli orari di apertura.
 *
 * @param date giorno di riferimento (si usa la sola parte di data)
 * @param slotMinutes durata dello slot
 * @param stepMinutes passo di avvio; se omesso coincide con slotMinutes
 */
export function generateSlots(
  date: Date,
  hours: OpeningHours,
  slotMinutes: number,
  stepMinutes: number = slotMinutes,
): TimeRange[] {
  if (slotMinutes <= 0 || stepMinutes <= 0) {
    throw new Error('generateSlots: durata e passo devono essere positivi');
  }
  if (hours.closesAtMinutes <= hours.opensAtMinutes) {
    return [];
  }

  const dayStart = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  ).getTime();

  const slots: TimeRange[] = [];
  for (
    let m = hours.opensAtMinutes;
    m + slotMinutes <= hours.closesAtMinutes;
    m += stepMinutes
  ) {
    slots.push({
      start: new Date(dayStart + m * 60_000),
      end: new Date(dayStart + (m + slotMinutes) * 60_000),
    });
  }
  return slots;
}

/**
 * Marca come non disponibili gli slot che si sovrappongono a prenotazioni
 * esistenti, a chiusure straordinarie, o che sono già passati.
 */
export function markAvailability(
  slots: readonly TimeRange[],
  bookings: readonly TimeRange[],
  closures: readonly TimeRange[] = [],
  now?: Date,
): Slot[] {
  return slots.map((slot) => {
    const past = now !== undefined && slot.start.getTime() <= now.getTime();
    const busy = overlapsAny(slot, bookings) || overlapsAny(slot, closures);
    return { ...slot, available: !past && !busy };
  });
}

/**
 * Disponibilità di una linea per una giornata: composizione delle tre funzioni
 * precedenti. È il punto d'ingresso usato dall'API.
 */
export function findAvailableSlots(params: {
  date: Date;
  hours: OpeningHours;
  slotMinutes: number;
  stepMinutes?: number;
  bookings: readonly TimeRange[];
  closures?: readonly TimeRange[];
  now?: Date;
}): Slot[] {
  const slots = generateSlots(
    params.date,
    params.hours,
    params.slotMinutes,
    params.stepMinutes ?? params.slotMinutes,
  );
  return markAvailability(
    slots,
    params.bookings,
    params.closures ?? [],
    params.now,
  );
}

/** Converte "HH:MM" in minuti dalla mezzanotte. */
export function parseTimeToMinutes(value: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) throw new Error(`parseTimeToMinutes: formato non valido "${value}"`);
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    throw new Error(`parseTimeToMinutes: orario non valido "${value}"`);
  }
  return hours * 60 + minutes;
}
