import { describe, expect, it } from 'vitest';
import {
  EXERCISES_PER_YEAR,
  ROUNDS_PER_EXERCISE,
  computeGpgSchedule,
  computeGpgStatus,
  nextGpgExercise,
  type GpgExerciseRecord,
} from './index.js';

const d = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('computeGpgSchedule', () => {
  it('produce tre esercitazioni', () => {
    const s = computeGpgSchedule(d('2026-03-15'), 2026);
    expect(s).toHaveLength(EXERCISES_PER_YEAR);
    expect(s.map((e) => e.sequence)).toEqual([1, 2, 3]);
  });

  it('scadenze a cadenza quadrimestrale dalla data sul porto d armi', () => {
    const s = computeGpgSchedule(d('2026-03-15'), 2026);
    expect(s[0]!.dueBy.toISOString().slice(0, 10)).toBe('2026-07-15');
    expect(s[1]!.dueBy.toISOString().slice(0, 10)).toBe('2026-11-15');
    expect(s[2]!.dueBy.toISOString().slice(0, 10)).toBe('2027-03-15');
  });

  it('le finestre sono contigue e non si sovrappongono', () => {
    const s = computeGpgSchedule(d('2026-03-15'), 2026);
    expect(s[1]!.windowFrom.getTime()).toBe(s[0]!.dueBy.getTime());
    expect(s[2]!.windowFrom.getTime()).toBe(s[1]!.dueBy.getTime());
  });

  it('solo la terza esercitazione e certificante', () => {
    const s = computeGpgSchedule(d('2026-03-15'), 2026);
    expect(s.map((e) => e.certifying)).toEqual([false, false, true]);
  });

  it('gestisce il 31 del mese senza slittare al mese successivo', () => {
    // 31 ottobre + 4 mesi = 28 febbraio (2027 non bisestile), non 3 marzo
    const s = computeGpgSchedule(d('2026-10-31'), 2026);
    expect(s[0]!.dueBy.toISOString().slice(0, 10)).toBe('2027-02-28');
  });

  it('gestisce il 29 febbraio di un anno bisestile', () => {
    const s = computeGpgSchedule(d('2024-02-29'), 2024);
    expect(s[0]!.dueBy.toISOString().slice(0, 10)).toBe('2024-06-29');
  });

  it('ancora il ciclo all anno richiesto, non a quello della scadenza', () => {
    const s = computeGpgSchedule(d('2020-05-10'), 2026);
    expect(s[0]!.windowFrom.toISOString().slice(0, 10)).toBe('2026-05-10');
  });
});

describe('computeGpgStatus', () => {
  const expiry = d('2026-03-15');

  it('esercitazione lontana: nessun avviso', () => {
    const s = computeGpgStatus(expiry, 2026, [], d('2026-03-20'));
    expect(s[0]!.level).toBe('ok');
    expect(s[0]!.daysRemaining).toBe(117);
  });

  it('entro 60 giorni: in scadenza', () => {
    const s = computeGpgStatus(expiry, 2026, [], d('2026-06-01'));
    expect(s[0]!.level).toBe('in_scadenza');
  });

  it('entro 7 giorni: urgente', () => {
    const s = computeGpgStatus(expiry, 2026, [], d('2026-07-10'));
    expect(s[0]!.level).toBe('urgente');
    expect(s[0]!.daysRemaining).toBe(5);
  });

  it('il giorno stesso della scadenza e urgente, non scaduta', () => {
    const s = computeGpgStatus(expiry, 2026, [], d('2026-07-15'));
    expect(s[0]!.level).toBe('urgente');
    expect(s[0]!.daysRemaining).toBe(0);
    expect(s[0]!.message).toContain('scade oggi');
  });

  it('termine superato: scaduta, con il numero di giorni', () => {
    const s = computeGpgStatus(expiry, 2026, [], d('2026-07-25'));
    expect(s[0]!.level).toBe('scaduta');
    expect(s[0]!.daysRemaining).toBe(-10);
    expect(s[0]!.message).toContain('10 giorni');
  });

  it('esercitazione svolta: livello ok anche oltre il termine', () => {
    const performed: GpgExerciseRecord[] = [
      { sequence: 1, performedAt: d('2026-06-20'), roundsFired: 50, score: 180 },
    ];
    const s = computeGpgStatus(expiry, 2026, performed, d('2026-08-01'));
    expect(s[0]!.performed).toBe(true);
    expect(s[0]!.level).toBe('ok');
    expect(s[1]!.performed).toBe(false);
  });

  it('il messaggio della terza cita il patentino e i colpi richiesti', () => {
    const s = computeGpgStatus(expiry, 2026, [], d('2026-11-20'));
    expect(s[2]!.message).toContain('patentino');
    expect(s[2]!.message).toContain(String(ROUNDS_PER_EXERCISE));
  });
});

describe('nextGpgExercise', () => {
  const expiry = d('2026-03-15');

  it('restituisce la prima non svolta', () => {
    const performed: GpgExerciseRecord[] = [
      { sequence: 1, performedAt: d('2026-06-20'), roundsFired: 50 },
    ];
    const next = nextGpgExercise(computeGpgStatus(expiry, 2026, performed, d('2026-07-01')));
    expect(next?.sequence).toBe(2);
  });

  it('restituisce null quando sono state svolte tutte', () => {
    const performed: GpgExerciseRecord[] = [1, 2, 3].map((n) => ({
      sequence: n as 1 | 2 | 3,
      performedAt: d('2026-06-20'),
      roundsFired: 50,
    }));
    expect(nextGpgExercise(computeGpgStatus(expiry, 2026, performed, d('2027-01-01')))).toBeNull();
  });
});
