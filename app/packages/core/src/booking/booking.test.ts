import { describe, expect, it } from 'vitest';
import {
  detectOverlap,
  findAvailableSlots,
  generateSlots,
  markAvailability,
  parseTimeToMinutes,
  type TimeRange,
} from './index.js';

const t = (iso: string) => new Date(`2026-09-12T${iso}:00Z`);
const range = (from: string, to: string): TimeRange => ({ start: t(from), end: t(to) });
const day = new Date('2026-09-12T00:00:00Z');
const hours = { opensAtMinutes: 9 * 60, closesAtMinutes: 13 * 60 };

describe('detectOverlap', () => {
  it('riconosce la sovrapposizione parziale', () => {
    expect(detectOverlap(range('09:00', '10:00'), range('09:30', '10:30'))).toBe(true);
  });

  it('riconosce il contenimento', () => {
    expect(detectOverlap(range('09:00', '12:00'), range('10:00', '11:00'))).toBe(true);
  });

  it('il contatto agli estremi non e sovrapposizione', () => {
    expect(detectOverlap(range('09:00', '10:00'), range('10:00', '11:00'))).toBe(false);
  });

  it('intervalli disgiunti non si sovrappongono', () => {
    expect(detectOverlap(range('09:00', '10:00'), range('11:00', '12:00'))).toBe(false);
  });

  it('e simmetrica', () => {
    const a = range('09:00', '10:30');
    const b = range('10:00', '11:00');
    expect(detectOverlap(a, b)).toBe(detectOverlap(b, a));
  });
});

describe('generateSlots', () => {
  it('genera slot consecutivi nell orario di apertura', () => {
    const slots = generateSlots(day, hours, 60);
    expect(slots).toHaveLength(4);
    expect(slots[0]!.start.toISOString()).toBe('2026-09-12T09:00:00.000Z');
    expect(slots[3]!.end.toISOString()).toBe('2026-09-12T13:00:00.000Z');
  });

  it('non genera slot che sforano la chiusura', () => {
    const slots = generateSlots(day, { opensAtMinutes: 9 * 60, closesAtMinutes: 9 * 60 + 90 }, 60);
    expect(slots).toHaveLength(1);
  });

  it('supporta un passo piu breve della durata (slot sovrapposti)', () => {
    const slots = generateSlots(day, hours, 60, 30);
    expect(slots).toHaveLength(7);
  });

  it('orario di chiusura non successivo all apertura: nessuno slot', () => {
    expect(generateSlots(day, { opensAtMinutes: 600, closesAtMinutes: 600 }, 60)).toEqual([]);
  });

  it('rifiuta durata o passo non positivi', () => {
    expect(() => generateSlots(day, hours, 0)).toThrow();
    expect(() => generateSlots(day, hours, 60, 0)).toThrow();
  });
});

describe('markAvailability', () => {
  const slots = generateSlots(day, hours, 60);

  it('marca occupato lo slot che si sovrappone a una prenotazione', () => {
    const result = markAvailability(slots, [range('10:00', '11:00')]);
    expect(result.map((s) => s.available)).toEqual([true, false, true, true]);
  });

  it('una prenotazione a cavallo occupa entrambi gli slot', () => {
    const result = markAvailability(slots, [range('10:30', '11:30')]);
    expect(result.map((s) => s.available)).toEqual([true, false, false, true]);
  });

  it('le chiusure straordinarie occupano come le prenotazioni', () => {
    const result = markAvailability(slots, [], [range('09:00', '10:00')]);
    expect(result[0]!.available).toBe(false);
  });

  it('gli slag gia iniziati non sono prenotabili', () => {
    const result = markAvailability(slots, [], [], t('10:15'));
    expect(result.map((s) => s.available)).toEqual([false, false, true, true]);
  });

  it('senza riferimento temporale non filtra il passato', () => {
    expect(markAvailability(slots, []).every((s) => s.available)).toBe(true);
  });
});

describe('findAvailableSlots', () => {
  it('compone generazione e disponibilita', () => {
    const result = findAvailableSlots({
      date: day,
      hours,
      slotMinutes: 60,
      bookings: [range('09:00', '10:00'), range('12:00', '13:00')],
      now: t('08:00'),
    });
    expect(result.filter((s) => s.available)).toHaveLength(2);
  });

  it('prenotazione telefonica inserita dal gestore occupa come quella online', () => {
    // Rischio 6 del business plan: doppio binario online/telefono.
    const phoneBooking = range('11:00', '12:00');
    const result = findAvailableSlots({
      date: day,
      hours,
      slotMinutes: 60,
      bookings: [phoneBooking],
    });
    expect(result.find((s) => s.start.getTime() === t('11:00').getTime())!.available).toBe(false);
  });
});

describe('parseTimeToMinutes', () => {
  it('converte orari validi', () => {
    expect(parseTimeToMinutes('09:00')).toBe(540);
    expect(parseTimeToMinutes('9:30')).toBe(570);
    expect(parseTimeToMinutes('23:59')).toBe(1439);
    expect(parseTimeToMinutes('00:00')).toBe(0);
  });

  it('rifiuta formati e valori non validi', () => {
    expect(() => parseTimeToMinutes('9')).toThrow();
    expect(() => parseTimeToMinutes('24:00')).toThrow();
    expect(() => parseTimeToMinutes('10:60')).toThrow();
    expect(() => parseTimeToMinutes('abc')).toThrow();
  });
});
