import { supabase } from '@/api/supabaseClient';

const WEEKDAY_LABEL = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

function formatHoursNotes(hours) {
  if (!hours?.length) return undefined;
  return hours
    .map((h) => `${WEEKDAY_LABEL[h.weekday] ?? ''} ${h.opens_at}-${h.closes_at}`.trim())
    .join('\n');
}

function formatPricingNotes(pricing) {
  if (!pricing?.length) return undefined;
  return pricing
    .map((p) => `${p.item}: ${(p.price_cents / 100).toFixed(2)}€${p.unit ? `/${p.unit}` : ''}`)
    .join('\n');
}

/** Elenco strutture pubblicabili, dati anagrafici (no linee/orari/prezzi: evita N+1 query). */
export async function listRanges() {
  const { data, error } = await supabase.from('ranges_public').select('*').order('name');
  if (error) throw error;
  return (data || []).map((r) => ({
    ...r,
    calibers: [],
    distances_m: [],
  }));
}

/** Dettaglio struttura: anagrafica + linee/orari/prezzi/servizi appiattiti. */
export async function getRange(id) {
  const [{ data: base, error: baseError }, { data: lines }, { data: hours }, { data: pricing }, { data: services }] =
    await Promise.all([
      supabase.from('ranges_public').select('*').eq('id', id).single(),
      supabase.from('range_lines').select('*').eq('range_id', id),
      supabase.from('range_hours').select('*').eq('range_id', id),
      supabase.from('range_pricing').select('*').eq('range_id', id),
      supabase.from('range_services').select('*').eq('range_id', id),
    ]);
  if (baseError) throw baseError;
  if (!base) return null;

  return {
    ...base,
    calibers: [...new Set((lines || []).flatMap((l) => l.calibers || []))],
    disciplines: [...new Set((lines || []).flatMap((l) => l.disciplines || []))],
    distances_m: (lines || []).map((l) => l.distance_m),
    is_indoor: (lines || []).some((l) => l.is_indoor),
    is_outdoor: (lines || []).some((l) => !l.is_indoor),
    services: (services || []).filter((s) => s.available).map((s) => s.service),
    hours_notes: formatHoursNotes(hours),
    pricing_notes: formatPricingNotes(pricing),
  };
}
