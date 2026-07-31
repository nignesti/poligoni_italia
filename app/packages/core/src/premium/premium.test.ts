import { describe, expect, it } from 'vitest';
import {
  FREE_TIER_LIMITS,
  PASS_PRO_LAUNCH_USER_THRESHOLD,
  PREMIUM_FEATURES,
  checkFirearmsQuota,
  checkTargetsQuota,
  hasFeatureAccess,
  isPassProLaunchReady,
  isSessionWithinFreeHistory,
  lockedFeatures,
} from './index.js';

const d = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('hasFeatureAccess', () => {
  it('nega ogni funzionalità premium al piano gratuito', () => {
    for (const f of PREMIUM_FEATURES) {
      expect(hasFeatureAccess('gratuito', f.feature)).toBe(false);
    }
  });

  it('concede ogni funzionalità premium a Pass Pro', () => {
    for (const f of PREMIUM_FEATURES) {
      expect(hasFeatureAccess('pass_pro', f.feature)).toBe(true);
    }
  });
});

describe('lockedFeatures', () => {
  it('elenca tutte le funzionalità per il piano gratuito', () => {
    expect(lockedFeatures('gratuito')).toEqual(PREMIUM_FEATURES);
  });

  it('nessuna funzionalità bloccata per Pass Pro', () => {
    expect(lockedFeatures('pass_pro')).toHaveLength(0);
  });
});

describe('checkFirearmsQuota', () => {
  it('consente sotto il limite', () => {
    const q = checkFirearmsQuota('gratuito', 2);
    expect(q).toEqual({ allowed: true, limit: 3, used: 2, remaining: 1 });
  });

  it('blocca esattamente al limite', () => {
    const q = checkFirearmsQuota('gratuito', FREE_TIER_LIMITS.maxFirearms);
    expect(q.allowed).toBe(false);
    expect(q.remaining).toBe(0);
  });

  it('blocca oltre il limite, senza remaining negativo', () => {
    const q = checkFirearmsQuota('gratuito', 10);
    expect(q.allowed).toBe(false);
    expect(q.remaining).toBe(0);
  });

  it('azzera un used negativo (correzione dati incoerente)', () => {
    const q = checkFirearmsQuota('gratuito', -5);
    expect(q.used).toBe(0);
    expect(q.allowed).toBe(true);
  });

  it('Pass Pro non ha limite', () => {
    const q = checkFirearmsQuota('pass_pro', 500);
    expect(q.allowed).toBe(true);
    expect(q.limit).toBe(Infinity);
    expect(q.remaining).toBe(Infinity);
  });
});

describe('checkTargetsQuota', () => {
  it('consente sotto il limite mensile', () => {
    const q = checkTargetsQuota('gratuito', 4);
    expect(q).toEqual({ allowed: true, limit: 5, used: 4, remaining: 1 });
  });

  it('blocca esattamente al limite', () => {
    const q = checkTargetsQuota('gratuito', FREE_TIER_LIMITS.maxTargetsPerMonth);
    expect(q.allowed).toBe(false);
  });

  it('Pass Pro non ha limite mensile', () => {
    const q = checkTargetsQuota('pass_pro', 1000);
    expect(q.allowed).toBe(true);
  });
});

describe('isSessionWithinFreeHistory', () => {
  const today = d('2026-07-31');

  it('sessione recente è visibile', () => {
    expect(isSessionWithinFreeHistory('gratuito', d('2026-07-01'), today)).toBe(true);
  });

  it('sessione esattamente al limite dei 90 giorni è visibile', () => {
    const exactlyAtLimit = new Date(today.getTime() - FREE_TIER_LIMITS.sessionHistoryDays * 86_400_000);
    expect(isSessionWithinFreeHistory('gratuito', exactlyAtLimit, today)).toBe(true);
  });

  it('sessione oltre 90 giorni non è visibile sul piano gratuito', () => {
    expect(isSessionWithinFreeHistory('gratuito', d('2025-01-01'), today)).toBe(false);
  });

  it('Pass Pro vede sempre tutto lo storico', () => {
    expect(isSessionWithinFreeHistory('pass_pro', d('2020-01-01'), today)).toBe(true);
  });
});

describe('isPassProLaunchReady', () => {
  it('non pronto sotto la soglia', () => {
    expect(isPassProLaunchReady(9_999)).toBe(false);
  });

  it('pronto esattamente alla soglia', () => {
    expect(isPassProLaunchReady(PASS_PRO_LAUNCH_USER_THRESHOLD)).toBe(true);
  });

  it('pronto oltre la soglia', () => {
    expect(isPassProLaunchReady(50_000)).toBe(true);
  });

  it('zero utenti non è pronto', () => {
    expect(isPassProLaunchReady(0)).toBe(false);
  });
});
