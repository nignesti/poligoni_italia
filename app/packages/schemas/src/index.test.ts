import { describe, expect, it } from 'vitest';
import {
  rangeSearchQuerySchema,
  createBookingRequestSchema,
  createSessionSchema,
  createAmmoMovementSchema,
  createUserDocumentSchema,
  gpgStatusResponseSchema,
} from './index.js';

describe('rangeSearchQuerySchema', () => {
  it('accetta una richiesta valida', () => {
    const result = rangeSearchQuerySchema.parse({ lat: 45.0, lng: 9.0 });
    expect(result.lat).toBe(45);
    expect(result.radius).toBe(50); // default
    expect(result.limit).toBe(20); // default
  });

  it('accetta filtri opzionali come stringhe singole', () => {
    const result = rangeSearchQuerySchema.parse({
      lat: '45.0',
      lng: '9.0',
      calibers: '9x21',
    });
    expect(result.calibers).toEqual(['9x21']);
  });

  it('rifiuta coordinate fuori range', () => {
    expect(() => rangeSearchQuerySchema.parse({ lat: 100, lng: 0 })).toThrow();
    expect(() => rangeSearchQuerySchema.parse({ lat: 0, lng: 200 })).toThrow();
  });
});

describe('createBookingRequestSchema', () => {
  it('accetta una prenotazione valida', () => {
    const data = {
      rangeId: '550e8400-e29b-41d4-a716-446655440000',
      lineId: '550e8400-e29b-41d4-a716-446655440001',
      slotStart: '2026-09-12T09:00:00.000Z',
      slotEnd: '2026-09-12T10:00:00.000Z',
      idempotencyKey: 'req-001',
    };
    const result = createBookingRequestSchema.parse(data);
    expect(result.idempotencyKey).toBe('req-001');
  });

  it('rifiuta date non ISO', () => {
    expect(() =>
      createBookingRequestSchema.parse({
        rangeId: '550e8400-e29b-41d4-a716-446655440000',
        lineId: '550e8400-e29b-41d4-a716-446655440001',
        slotStart: '12/09/2026',
        slotEnd: '2026-09-12T10:00:00.000Z',
        idempotencyKey: 'req-001',
      }),
    ).toThrow();
  });
});

describe('createAmmoMovementSchema', () => {
  it('accetta un movimento valido', () => {
    const result = createAmmoMovementSchema.parse({
      caliber: '9x21',
      category: 'arma_corta',
      delta: 100,
      reason: 'acquisto',
      occurredAt: '2026-09-12T10:00:00.000Z',
    });
    expect(result.delta).toBe(100);
  });

  it('rifiuta una categoria non valida', () => {
    expect(() =>
      createAmmoMovementSchema.parse({
        caliber: '9x21',
        category: 'fucile',
        delta: 100,
        reason: 'acquisto',
        occurredAt: '2026-09-12T10:00:00.000Z',
      }),
    ).toThrow();
  });
});

describe('createUserDocumentSchema', () => {
  it('accetta un documento senza file (caso base)', () => {
    const result = createUserDocumentSchema.parse({
      type: 'certificato_medico',
      expiresOn: '2027-06-01',
    });
    expect(result.type).toBe('certificato_medico');
  });
});

describe('gpgStatusResponseSchema', () => {
  it('accetta una risposta GPG valida', () => {
    const data = {
      portoArmiExpiresOn: '2027-03-15',
      exercises: [
        {
          sequence: 1,
          windowFrom: '2026-07-15',
          dueBy: '2026-11-15',
          certifying: false,
          performed: true,
          performedAt: '2026-08-01',
          daysRemaining: -45,
          level: 'ok',
          message: 'Svolta',
        },
        {
          sequence: 2,
          windowFrom: '2026-11-15',
          dueBy: '2027-03-15',
          certifying: false,
          performed: false,
          performedAt: null,
          daysRemaining: 120,
          level: 'ok',
          message: 'Mancano 120 giorni',
        },
        {
          sequence: 3,
          windowFrom: '2027-03-15',
          dueBy: '2027-07-15',
          certifying: true,
          performed: false,
          performedAt: null,
          daysRemaining: 240,
          level: 'ok',
          message: 'Mancano 240 giorni',
        },
      ],
      nextExercise: {
        sequence: 2,
        windowFrom: '2026-11-15',
        dueBy: '2027-03-15',
        certifying: false,
        performed: false,
        performedAt: null,
        daysRemaining: 120,
        level: 'ok',
        message: 'Mancano 120 giorni',
      },
    };
    const result = gpgStatusResponseSchema.parse(data);
    expect(result.exercises).toHaveLength(3);
    expect(result.nextExercise?.sequence).toBe(2);
  });
});
