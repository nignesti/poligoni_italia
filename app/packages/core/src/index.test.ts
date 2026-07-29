import { describe, expect, it } from 'vitest';
import * as core from './index.js';

describe('superficie pubblica di @poligoni/core', () => {
  it('espone i cinque moduli di dominio', () => {
    expect(Object.keys(core).sort()).toEqual([
      'ammo',
      'ballistics',
      'booking',
      'documents',
      'gpg',
    ]);
  });

  it('espone le funzioni usate da web e mobile', () => {
    expect(typeof core.ammo.evaluateAmmoLimits).toBe('function');
    expect(typeof core.ballistics.computeGroupStats).toBe('function');
    expect(typeof core.gpg.computeGpgStatus).toBe('function');
    expect(typeof core.documents.computeDocumentAlerts).toBe('function');
    expect(typeof core.booking.findAvailableSlots).toBe('function');
  });

  it('espone l avvertenza obbligatoria sulle munizioni', () => {
    expect(core.ammo.AMMO_DISCLAIMER).toBeTruthy();
  });
});
