import { describe, expect, it } from 'vitest';
import * as core from './index.js';

describe('superficie pubblica di @poligoni/core', () => {
  it('espone gli otto moduli di dominio', () => {
    expect(Object.keys(core).sort()).toEqual([
      'ammo',
      'ballistics',
      'billing',
      'booking',
      'documents',
      'gpg',
      'premium',
      'slug',
    ]);
  });

  it('espone le funzioni usate da web, mobile e seed del database', () => {
    expect(typeof core.ammo.evaluateAmmoLimits).toBe('function');
    expect(typeof core.ballistics.computeGroupStats).toBe('function');
    expect(typeof core.billing.calculateVAT).toBe('function');
    expect(typeof core.gpg.computeGpgStatus).toBe('function');
    expect(typeof core.documents.computeDocumentAlerts).toBe('function');
    expect(typeof core.booking.findAvailableSlots).toBe('function');
    expect(typeof core.premium.hasFeatureAccess).toBe('function');
    expect(typeof core.slug.slugify).toBe('function');
  });

  it('espone l avvertenza obbligatoria sulle munizioni', () => {
    expect(core.ammo.AMMO_DISCLAIMER).toBeTruthy();
  });
});
