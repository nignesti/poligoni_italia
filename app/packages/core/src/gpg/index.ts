/**
 * Libretto di tiro per le Guardie Particolari Giurate.
 *
 * Obbligo: tre esercitazioni annuali a cadenza quadrimestrale, 50 colpi ciascuna,
 * la terza con rilascio del patentino (DM 1 dicembre 2010 n. 269 e normativa UITS).
 * Riferimento: Business_Plan_Poligoni_Italia_v2.md §3.5.5.
 *
 * ⚠️  DA VERIFICARE CON UN ISTITUTO DI VIGILANZA PRIMA DEL RILASCIO
 * (Piano_Sviluppo_App.md §5.3). L'interpretazione adottata qui è che il ciclo
 * decorra dalla data di scadenza riportata sul porto d'armi e che ciascuna
 * esercitazione vada svolta ENTRO la fine del proprio quadrimestre. La cadenza è
 * documentata da fonti di sezione, ma la pratica applicativa può variare — e
 * questa funzione dà una data a qualcuno che rischia una sanzione.
 */

export const ROUNDS_PER_EXERCISE = 50;
export const EXERCISES_PER_YEAR = 3;

/** Giorni di anticipo degli avvisi. */
export const ALERT_DAYS = [60, 30, 7] as const;

export type ExerciseSequence = 1 | 2 | 3;

export interface GpgExerciseDue {
  readonly sequence: ExerciseSequence;
  /** Inizio della finestra utile. */
  readonly windowFrom: Date;
  /** Termine entro cui l'esercitazione va svolta. */
  readonly dueBy: Date;
  /** La terza esercitazione comporta il rilascio del patentino. */
  readonly certifying: boolean;
}

export interface GpgExerciseRecord {
  readonly sequence: ExerciseSequence;
  readonly performedAt: Date;
  readonly roundsFired: number;
  readonly score?: number;
}

export type GpgAlertLevel = 'ok' | 'in_scadenza' | 'urgente' | 'scaduta';

export interface GpgExerciseStatus extends GpgExerciseDue {
  readonly performed: boolean;
  readonly performedAt: Date | null;
  readonly daysRemaining: number;
  readonly level: GpgAlertLevel;
  readonly message: string;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const targetDay = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + months, 1);
  const lastDay = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
  d.setUTCDate(Math.min(targetDay, lastDay));
  return d;
}

function startOfDayUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function daysBetween(from: Date, to: Date): number {
  const ms = startOfDayUTC(to).getTime() - startOfDayUTC(from).getTime();
  return Math.round(ms / 86_400_000);
}

/**
 * Calcola le tre scadenze quadrimestrali per l'anno indicato.
 *
 * @param portoArmiExpiresOn data di scadenza sul porto d'armi, da cui decorre il ciclo
 * @param year anno di riferimento
 */
export function computeGpgSchedule(
  portoArmiExpiresOn: Date,
  year: number,
): GpgExerciseDue[] {
  const anchor = startOfDayUTC(
    new Date(
      Date.UTC(
        year,
        portoArmiExpiresOn.getUTCMonth(),
        portoArmiExpiresOn.getUTCDate(),
      ),
    ),
  );

  return ([1, 2, 3] as const).map((sequence) => ({
    sequence,
    windowFrom: addMonths(anchor, (sequence - 1) * 4),
    dueBy: addMonths(anchor, sequence * 4),
    certifying: sequence === 3,
  }));
}

function levelFor(daysRemaining: number, performed: boolean): GpgAlertLevel {
  if (performed) return 'ok';
  if (daysRemaining < 0) return 'scaduta';
  if (daysRemaining <= 7) return 'urgente';
  if (daysRemaining <= 60) return 'in_scadenza';
  return 'ok';
}

/**
 * Incrocia le scadenze con le esercitazioni effettivamente svolte e produce
 * lo stato di ciascuna, con il livello di avviso.
 */
export function computeGpgStatus(
  portoArmiExpiresOn: Date,
  year: number,
  performed: readonly GpgExerciseRecord[],
  today: Date,
): GpgExerciseStatus[] {
  return computeGpgSchedule(portoArmiExpiresOn, year).map((due) => {
    const record = performed.find((p) => p.sequence === due.sequence);
    const daysRemaining = daysBetween(today, due.dueBy);
    const level = levelFor(daysRemaining, record !== undefined);

    const message = (() => {
      if (record) {
        return `Esercitazione ${due.sequence} di 3 svolta il ${record.performedAt.toLocaleDateString('it-IT', { timeZone: 'UTC' })}.`;
      }
      const label = due.certifying
        ? `Esercitazione ${due.sequence} di 3 (rilascio patentino)`
        : `Esercitazione ${due.sequence} di 3`;
      if (daysRemaining < 0) {
        return `${label}: termine superato da ${Math.abs(daysRemaining)} giorni.`;
      }
      if (daysRemaining === 0) {
        return `${label}: scade oggi.`;
      }
      return `${label}: mancano ${daysRemaining} giorni. Servono ${ROUNDS_PER_EXERCISE} colpi.`;
    })();

    return {
      ...due,
      performed: record !== undefined,
      performedAt: record?.performedAt ?? null,
      daysRemaining,
      level,
      message,
    };
  });
}

/** Prima esercitazione non ancora svolta, se esiste. */
export function nextGpgExercise(
  statuses: readonly GpgExerciseStatus[],
): GpgExerciseStatus | null {
  return statuses.find((s) => !s.performed) ?? null;
}
