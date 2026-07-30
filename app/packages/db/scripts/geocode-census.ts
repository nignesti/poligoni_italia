/**
 * Geocodifica il censimento (src/seed/census-2026-07.ts) via Nominatim
 * (OpenStreetMap, gratuito, nessuna chiave), come suggerito dal documento
 * originale (§3 "Geocoding").
 *
 * IMPORTANTE -- livello di precisione: geocodifica il CENTROIDE DEL COMUNE,
 * non l'indirizzo esatto della struttura. Il documento originale non ha
 * indirizzi verificati per la maggior parte delle righe (solo la tabella
 * "Privati" ne ha alcuni, mai geocodificati con precisione civica qui).
 * Usare il centroide comunale come "posizione approssimativa, da
 * verificare sul campo" è onesto; inventare una coordinata precisa per un
 * indirizzo non verificato non lo sarebbe (BP §3.5.8, stesso principio
 * applicato ai dati di detenzione: mai fabbricare precisione che non si ha).
 *
 * Rispetta la usage policy di Nominatim: 1 richiesta/secondo, User-Agent
 * descrittivo con contatto. Va eseguito occasionalmente da un mantenitore,
 * non ad ogni build: scrive un file statico che viene poi letto dal seed.
 *
 * Uso: pnpm db:geocode
 */
import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CENSUS_ROWS } from '../src/seed/census-2026-07.js';
import { provinciaFromSigla } from '../src/seed/province-sigle.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = path.join(__dirname, '../src/seed/census-2026-07.coords.json');

const USER_AGENT =
  'PoligoniItaliaSeed/0.1 (censimento poligoni di tiro; contatto: info@poligoniitalia.it)';

interface CoordEntry {
  lat: number;
  lng: number;
  /** Precisione: sempre "comune" in questo script, mai un indirizzo civico. */
  precision: 'comune';
  resolvedAt: string;
  displayName: string;
}

type CoordsCache = Record<string, CoordEntry>;

function keyFor(comune: string, provinciaSigla: string): string {
  return `${comune}|${provinciaSigla}`;
}

async function loadExisting(): Promise<CoordsCache> {
  if (!existsSync(OUT_FILE)) return {};
  return JSON.parse(await readFile(OUT_FILE, 'utf-8')) as CoordsCache;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  addresstype?: string;
}

/**
 * Tipi di risultato accettati come "il centroide di un comune/frazione".
 * Qualunque altra cosa (una via, un esercizio commerciale, un fiume...) va
 * scartata: è la lezione del primo tentativo di questo script, in cui una
 * query in free-text ha abbinato "Milano" e "Roma" a una via di Bologna
 * chiamata "Via Milano" invece che alle rispettive città.
 */
const ACCEPTED_ADDRESS_TYPES = new Set([
  'city',
  'town',
  'village',
  'hamlet',
  'municipality',
  'administrative',
]);

function isPlausibleComuneMatch(r: NominatimResult): boolean {
  if (r.class === 'boundary' && r.type === 'administrative') return true;
  return ACCEPTED_ADDRESS_TYPES.has(r.addresstype ?? '');
}

async function queryNominatim(params: Record<string, string>): Promise<NominatimResult[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '3');
  url.searchParams.set('countrycodes', 'it');

  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as NominatimResult[];
}

/**
 * Geocodifica un comune usando i parametri STRUTTURATI di Nominatim
 * (city/county), non una stringa free-text: il parser free-text di
 * Nominatim può abbinare nomi di vie o locali che coincidono per errore
 * con il nome del comune (vedi commento sopra). Con `city=` la ricerca è
 * vincolata a entità amministrative, molto più affidabile.
 *
 * Se la ricerca vincolata alla provincia non trova nulla (frazioni minori
 * non sempre indicizzate con county), riprova senza il vincolo di provincia
 * e verifica comunque il tipo di risultato prima di accettarlo.
 */
async function geocodeComune(
  comune: string,
  provincia: string,
): Promise<Omit<CoordEntry, 'resolvedAt' | 'precision'> | null> {
  let results = await queryNominatim({ city: comune, county: provincia, country: 'Italy' });
  let candidate = results.find(isPlausibleComuneMatch);

  if (!candidate) {
    await sleep(1100);
    results = await queryNominatim({ city: comune, country: 'Italy' });
    candidate = results.find(isPlausibleComuneMatch);
  }

  if (!candidate) {
    console.warn(`  Nessun risultato amministrativo plausibile per "${comune}" (${provincia})`);
    return null;
  }

  return {
    lat: Number(candidate.lat),
    lng: Number(candidate.lon),
    displayName: candidate.display_name,
  };
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  const cache = await loadExisting();

  const uniquePairs = new Map<string, { comune: string; provinciaSigla: string }>();
  for (const row of CENSUS_ROWS) {
    uniquePairs.set(keyFor(row.comune, row.provinciaSigla), {
      comune: row.comune,
      provinciaSigla: row.provinciaSigla,
    });
  }

  const toResolve = [...uniquePairs.values()].filter((p) => !(keyFor(p.comune, p.provinciaSigla) in cache));

  console.log(`${uniquePairs.size} comuni unici, ${toResolve.length} da geocodificare (${uniquePairs.size - toResolve.length} già in cache).`);

  let resolved = 0;
  let failed = 0;

  for (const [i, pair] of toResolve.entries()) {
    const provincia = provinciaFromSigla(pair.provinciaSigla);
    process.stdout.write(`[${i + 1}/${toResolve.length}] ${pair.comune} (${provincia})... `);

    const result = await geocodeComune(pair.comune, provincia);
    if (result) {
      cache[keyFor(pair.comune, pair.provinciaSigla)] = {
        ...result,
        precision: 'comune',
        resolvedAt: new Date().toISOString(),
      };
      resolved++;
      console.log(`ok (${result.lat}, ${result.lng})`);
    } else {
      failed++;
      console.log('FALLITO');
    }

    // Politica di Nominatim: massimo 1 richiesta al secondo.
    if (i < toResolve.length - 1) await sleep(1100);
  }

  await writeFile(OUT_FILE, JSON.stringify(cache, null, 2) + '\n', 'utf-8');
  console.log(`\nScritto ${OUT_FILE}`);
  console.log(`Risolti in questa esecuzione: ${resolved}. Falliti: ${failed}. Totale in cache: ${Object.keys(cache).length}/${uniquePairs.size}.`);

  if (failed > 0) {
    console.warn('\nAlcuni comuni non sono stati geocodificati. Rilancia lo script (idempotente) o correggi il nome/provincia in census-2026-07.ts.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
