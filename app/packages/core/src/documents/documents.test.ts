import { describe, expect, it } from 'vitest';
import {
  computeDocumentAlerts,
  pendingDocumentAlerts,
  type UserDocument,
} from './index.js';

const d = (iso: string) => new Date(`${iso}T00:00:00Z`);
const today = d('2026-07-29');

const doc = (type: UserDocument['type'], expiresOn: string): UserDocument => ({
  type,
  expiresOn: d(expiresOn),
});

describe('computeDocumentAlerts', () => {
  it('documento lontano dalla scadenza: ok', () => {
    const [a] = computeDocumentAlerts([doc('porto_armi_tav', '2027-06-01')], today);
    expect(a!.level).toBe('ok');
  });

  it('entro 90 giorni: in scadenza', () => {
    const [a] = computeDocumentAlerts([doc('porto_armi_tav', '2026-10-01')], today);
    expect(a!.level).toBe('in_scadenza');
    expect(a!.daysRemaining).toBe(64);
  });

  it('entro 7 giorni: urgente', () => {
    const [a] = computeDocumentAlerts([doc('certificato_medico', '2026-08-03')], today);
    expect(a!.level).toBe('urgente');
  });

  it('scade oggi: urgente, non scaduto', () => {
    const [a] = computeDocumentAlerts([doc('certificato_medico', '2026-07-29')], today);
    expect(a!.level).toBe('urgente');
    expect(a!.message).toContain('scade oggi');
  });

  it('scade domani: messaggio dedicato', () => {
    const [a] = computeDocumentAlerts([doc('certificato_medico', '2026-07-30')], today);
    expect(a!.message).toContain('domani');
  });

  it('gia scaduto: livello scaduto con i giorni trascorsi', () => {
    const [a] = computeDocumentAlerts([doc('tessera_federale', '2026-07-01')], today);
    expect(a!.level).toBe('scaduto');
    expect(a!.daysRemaining).toBe(-28);
    expect(a!.message).toContain('28 giorni');
  });

  it('ordina per urgenza decrescente', () => {
    const alerts = computeDocumentAlerts(
      [
        doc('porto_armi_tav', '2027-01-01'),
        doc('certificato_medico', '2026-07-01'),
        doc('tessera_federale', '2026-09-01'),
      ],
      today,
    );
    expect(alerts.map((a) => a.type)).toEqual([
      'certificato_medico',
      'tessera_federale',
      'porto_armi_tav',
    ]);
  });

  it('etichetta ogni tipo di documento in italiano', () => {
    const alerts = computeDocumentAlerts(
      [doc('porto_gpg', '2026-12-01'), doc('porto_armi_caccia', '2026-12-01')],
      today,
    );
    expect(alerts.every((a) => a.label.length > 0)).toBe(true);
    expect(alerts.some((a) => a.label.includes('guardia giurata'))).toBe(true);
  });

  it('elenco vuoto', () => {
    expect(computeDocumentAlerts([], today)).toEqual([]);
  });
});

describe('pendingDocumentAlerts', () => {
  it('esclude i documenti in regola', () => {
    const alerts = computeDocumentAlerts(
      [doc('porto_armi_tav', '2027-06-01'), doc('certificato_medico', '2026-08-01')],
      today,
    );
    const pending = pendingDocumentAlerts(alerts);
    expect(pending).toHaveLength(1);
    expect(pending[0]!.type).toBe('certificato_medico');
  });
});
