import type { Discipline, OpeningHours, RangeType } from '@poligoni/schemas/ranges';

const WEEKDAYS = [
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
  'Domenica',
] as const;

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export const RANGE_TYPE_LABEL: Record<RangeType, string> = {
  tsn: 'Sezione TSN',
  privato: 'Poligono privato',
  tiro_a_volo: 'Tiro a volo',
  dinamico: 'Campo dinamico',
  long_range: 'Long range',
};

export const DISCIPLINE_LABEL: Record<Discipline, string> = {
  tiro_a_segno: 'Tiro a segno',
  tiro_a_volo: 'Tiro a volo',
  tiro_dinamico: 'Tiro dinamico',
  long_range: 'Long range',
  tiro_difensivo: 'Tiro difensivo',
  avancarica: 'Avancarica',
};

/**
 * Raggruppa gli orari per finestra identica invece di una riga per fascia
 * ("Lun-Ven 14:00-19:00" invece di cinque righe uguali). Evita l'anti-pattern
 * dello spec sheet a righe infinite: vedi design-taste-frontend §4.9.
 */
export interface HoursGroup {
  days: string[];
  opensAt: string;
  closesAt: string;
}

export function groupHours(hours: OpeningHours[]): HoursGroup[] {
  const byWindow = new Map<string, string[]>();
  for (const day of WEEKDAYS) {
    const entry = hours.find((h) => h.day === day);
    if (!entry) continue;
    const key = `${entry.opensAt}-${entry.closesAt}`;
    const list = byWindow.get(key);
    if (list) list.push(day);
    else byWindow.set(key, [day]);
  }

  return [...byWindow.entries()]
    .map(([key, days]) => {
      const [opensAt, closesAt] = key.split('-') as [string, string];
      return { days, opensAt, closesAt };
    })
    .sort(
      (a, b) => WEEKDAYS.indexOf(a.days[0] as (typeof WEEKDAYS)[number]) -
        WEEKDAYS.indexOf(b.days[0] as (typeof WEEKDAYS)[number]),
    );
}

/** "Lunedì" o, per giorni consecutivi, "Lun - Ven". Mai un elenco di 5 nomi. */
export function formatDayRange(days: string[]): string {
  if (days.length === 1) return days[0]!;

  const indices = days.map((d) => WEEKDAYS.indexOf(d as (typeof WEEKDAYS)[number]));
  const isConsecutive = indices.every((idx, i) => i === 0 || idx === indices[i - 1]! + 1);

  if (isConsecutive) {
    return `${days[0]!.slice(0, 3)} - ${days[days.length - 1]!.slice(0, 3)}`;
  }
  return days.map((d) => d.slice(0, 3)).join(', ');
}

export interface TodayStatus {
  open: boolean;
  label: string;
  detail: string;
}

/**
 * Stato di apertura per il giorno indicato. `now` è un parametro esplicito:
 * una funzione che legge l'orologio da sola produce output diverso fra server
 * e client e genera errori di hydration.
 */
export function todayStatus(hours: OpeningHours[], now: Date): TodayStatus {
  const isoWeekday = now.getDay() === 0 ? 7 : now.getDay();
  const todayName = WEEKDAYS[isoWeekday - 1]!;
  const today = hours.find((h) => h.day === todayName);

  if (!today) {
    return { open: false, label: 'Chiuso oggi', detail: '' };
  }

  const toMinutes = (t: string) => {
    const [h, m] = t.split(':');
    return Number(h) * 60 + Number(m);
  };
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const isOpen =
    minutesNow >= toMinutes(today.opensAt) && minutesNow < toMinutes(today.closesAt);

  return {
    open: isOpen,
    label: isOpen ? 'Aperto ora' : 'Chiuso ora',
    detail: isOpen
      ? `Chiude alle ${today.closesAt}`
      : `Oggi ${today.opensAt} - ${today.closesAt}`,
  };
}
