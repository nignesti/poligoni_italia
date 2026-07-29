/**
 * Scadenze documentali del tiratore.
 *
 * Il locker conserva, nel caso base, SOLO la data di scadenza: è sufficiente per
 * l'unica funzione richiesta (l'avviso) e tiene fuori dal sistema il dato
 * sanitario nel merito (Business_Plan_Poligoni_Italia_v2.md §14.2).
 */

export type DocumentType =
  | 'porto_armi_tav'
  | 'porto_armi_caccia'
  | 'porto_armi_difesa'
  | 'porto_gpg'
  | 'certificato_medico'
  | 'tessera_federale';

export type DocumentAlertLevel = 'ok' | 'in_scadenza' | 'urgente' | 'scaduto';

export interface UserDocument {
  readonly type: DocumentType;
  readonly expiresOn: Date;
}

export interface DocumentAlert {
  readonly type: DocumentType;
  readonly label: string;
  readonly expiresOn: Date;
  readonly daysRemaining: number;
  readonly level: DocumentAlertLevel;
  readonly message: string;
}

/** Giorni di anticipo degli avvisi (BP §13.2). */
export const ALERT_DAYS = [90, 30, 7] as const;

const LABELS: Record<DocumentType, string> = {
  porto_armi_tav: "Porto d'armi uso tiro a volo",
  porto_armi_caccia: "Porto d'armi uso caccia",
  porto_armi_difesa: "Porto d'armi per difesa personale",
  porto_gpg: "Porto d'armi guardia giurata",
  certificato_medico: 'Certificato medico',
  tessera_federale: 'Tessera federale',
};

function startOfDayUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function daysBetween(from: Date, to: Date): number {
  return Math.round(
    (startOfDayUTC(to).getTime() - startOfDayUTC(from).getTime()) / 86_400_000,
  );
}

function levelFor(daysRemaining: number): DocumentAlertLevel {
  if (daysRemaining < 0) return 'scaduto';
  if (daysRemaining <= 7) return 'urgente';
  if (daysRemaining <= 90) return 'in_scadenza';
  return 'ok';
}

/**
 * Produce un avviso per ogni documento, ordinati per urgenza decrescente.
 * Restituisce anche i documenti in regola: la schermata decide cosa mostrare.
 */
export function computeDocumentAlerts(
  documents: readonly UserDocument[],
  today: Date,
): DocumentAlert[] {
  return documents
    .map((doc) => {
      const daysRemaining = daysBetween(today, doc.expiresOn);
      const level = levelFor(daysRemaining);
      const label = LABELS[doc.type];

      const message = (() => {
        if (daysRemaining < 0) {
          return `${label}: scaduto da ${Math.abs(daysRemaining)} giorni.`;
        }
        if (daysRemaining === 0) return `${label}: scade oggi.`;
        if (daysRemaining === 1) return `${label}: scade domani.`;
        return `${label}: scade fra ${daysRemaining} giorni.`;
      })();

      return { type: doc.type, label, expiresOn: doc.expiresOn, daysRemaining, level, message };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/** Avvisi che richiedono attenzione: esclude i documenti in regola. */
export function pendingDocumentAlerts(
  alerts: readonly DocumentAlert[],
): DocumentAlert[] {
  return alerts.filter((a) => a.level !== 'ok');
}
