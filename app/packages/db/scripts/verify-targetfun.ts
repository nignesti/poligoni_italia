/**
 * Verifica i candidati raccolti da targetfun.it/blog/poligoni (405 righe grezze,
 * scraping manuale via browser, salvate in targetfun-raw.json) contro:
 *   1. Il nostro DB — per escludere quelli già censiti (dedup per nome+comune)
 *   2. Google Places Text Search — per confermare che il posto esiste davvero
 *      prima di considerarlo un candidato da aggiungere manualmente.
 *
 * Non scrive MAI nel database. Produce solo un report da rivedere a mano
 * (BP §2.5.4, principio di onestà dei dati: mai fabbricare, mai fidarsi
 * ciecamente di una fonte terza — vedi l'incidente A.B. Poligoni).
 *
 * Uso:
 *   GOOGLE_MAPS_API_KEY=... DATABASE_URL=... pnpm exec tsx scripts/verify-targetfun.ts --batch=1
 *   GOOGLE_MAPS_API_KEY=... DATABASE_URL=... pnpm exec tsx scripts/verify-targetfun.ts --batch=2
 *
 * --batch=1 → primi 200 candidati non ancora in DB
 * --batch=2 → candidati successivi (dal 201esimo in poi)
 * Senza --batch: stampa solo il conteggio dei candidati netti, non chiama l'API.
 *
 * Il report va in scripts/out/targetfun-verify-batch<N>.csv, mai committato
 * (aggiungere scripts/out/ a .gitignore se non già presente).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import postgres from 'postgres';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW_FILE = path.join(__dirname, 'targetfun-raw.json');
const OUT_DIR = path.join(__dirname, 'out');
const BATCH_SIZE = 200;

interface RawRow {
  regione: string;
  tipo: string;
  nome: string;
  citta: string;
  provincia: string;
  cap: string;
  indirizzo: string;
  telefono: string;
  sito: string;
  email: string;
  note: string;
}

interface ExistingRange {
  nome: string;
  comune: string;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // accenti
    .replace(/[^a-z0-9]/g, ''); // punteggiatura, spazi
}

/** Vero se nome+comune del candidato somigliano abbastanza a una riga già in DB. */
function isLikelyDuplicate(candidate: RawRow, existing: ExistingRange[]): boolean {
  const candNome = normalize(candidate.nome);
  const candCitta = normalize(candidate.citta);
  return existing.some((e) => {
    const exNome = normalize(e.nome);
    const exComune = normalize(e.comune);
    if (exComune !== candCitta) return false;
    // match esatto, o uno contiene l'altro (es. "TSN Pescara" vs "Tiro a Segno Nazionale Pescara")
    return exNome === candNome || exNome.includes(candNome) || candNome.includes(exNome);
  });
}

async function loadExisting(databaseUrl: string): Promise<ExistingRange[]> {
  const sql = postgres(databaseUrl, { max: 1 });
  try {
    const rows = await sql<{ name: string; comune: string }[]>`
      select name, comune from ranges
    `;
    return rows.map((r) => ({ nome: r.name, comune: r.comune }));
  } finally {
    await sql.end();
  }
}

interface PlacesResult {
  found: boolean;
  name?: string;
  formattedAddress?: string;
  businessStatus?: string;
  rating?: number;
  userRatingsTotal?: number;
  placeTypes?: string[];
}

async function searchPlace(apiKey: string, query: string): Promise<PlacesResult> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('language', 'it');
  url.searchParams.set('region', 'it');
  url.searchParams.set('key', apiKey);

  const res = await fetch(url);
  const data = (await res.json()) as {
    status: string;
    results: Array<{
      name: string;
      formatted_address: string;
      business_status?: string;
      rating?: number;
      user_ratings_total?: number;
      types?: string[];
    }>;
  };

  if (data.status !== 'OK' || !data.results.length) {
    return { found: false };
  }

  const top = data.results[0]!;
  return {
    found: true,
    name: top.name,
    formattedAddress: top.formatted_address,
    businessStatus: top.business_status,
    rating: top.rating,
    userRatingsTotal: top.user_ratings_total,
    placeTypes: top.types,
  };
}

/** Similarità grezza nome candidato vs nome trovato su Google, 0-1. */
function nameSimilarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.8;
  const wordsA = new Set(na.match(/.{3}/g) ?? []);
  const wordsB = new Set(nb.match(/.{3}/g) ?? []);
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let overlap = 0;
  for (const w of wordsA) if (wordsB.has(w)) overlap++;
  return overlap / Math.max(wordsA.size, wordsB.size);
}

function classify(candidate: RawRow, place: PlacesResult): { azione: string; confidenza: string } {
  if (!place.found) {
    return { azione: 'VERIFICA MANUALE — nessun match su Google Places', confidenza: 'bassa' };
  }
  if (place.businessStatus === 'CLOSED_PERMANENTLY') {
    return { azione: 'SCARTA — chiuso permanentemente secondo Google', confidenza: 'alta' };
  }
  const sim = nameSimilarity(candidate.nome, place.name ?? '');
  if (sim >= 0.5 && place.businessStatus !== 'CLOSED_TEMPORARILY') {
    return { azione: 'CANDIDATO VALIDO — verifica finale e importa', confidenza: 'alta' };
  }
  if (place.businessStatus === 'CLOSED_TEMPORARILY') {
    return { azione: 'VERIFICA MANUALE — chiuso temporaneamente', confidenza: 'media' };
  }
  return { azione: 'VERIFICA MANUALE — match debole, nome diverso da quello trovato', confidenza: 'media' };
}

function csvEscape(s: string): string {
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL non impostata.');
    process.exitCode = 1;
    return;
  }

  const raw: RawRow[] = JSON.parse(readFileSync(RAW_FILE, 'utf-8'));
  console.log(`Candidati grezzi da targetfun.it: ${raw.length}`);

  const existing = await loadExisting(databaseUrl);
  console.log(`Strutture già in DB: ${existing.length}`);

  const netCandidates = raw.filter((r) => !isLikelyDuplicate(r, existing));
  console.log(`Candidati netti (probabilmente non ancora in DB): ${netCandidates.length}`);
  console.log(`Probabili duplicati esclusi: ${raw.length - netCandidates.length}`);

  const batchArg = process.argv.find((a) => a.startsWith('--batch='));
  if (!batchArg) {
    console.log('\nNessun --batch specificato: solo conteggio, nessuna chiamata a Google Places.');
    console.log('Uso: pnpm exec tsx scripts/verify-targetfun.ts --batch=1   (primi 200)');
    console.log('     pnpm exec tsx scripts/verify-targetfun.ts --batch=2   (successivi)');
    return;
  }

  const batchNum = Number(batchArg.split('=')[1]);
  if (batchNum !== 1 && batchNum !== 2) {
    console.error('--batch deve essere 1 o 2.');
    process.exitCode = 1;
    return;
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY non impostata nell\'ambiente.');
    process.exitCode = 1;
    return;
  }

  const start = batchNum === 1 ? 0 : BATCH_SIZE;
  const end = batchNum === 1 ? BATCH_SIZE : netCandidates.length;
  const slice = netCandidates.slice(start, end);
  console.log(`\nBatch ${batchNum}: verifico ${slice.length} candidati (indici ${start}-${end - 1}) su Google Places...`);

  mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `targetfun-verify-batch${batchNum}.csv`);
  const header = [
    'regione', 'tipo', 'nome_targetfun', 'citta', 'provincia', 'telefono', 'sito_targetfun', 'email',
    'trovato_su_google', 'nome_google', 'indirizzo_google', 'stato_attivita', 'rating', 'recensioni',
    'azione_consigliata', 'confidenza',
  ];
  const lines: string[] = [header.join(',')];

  let i = 0;
  for (const candidate of slice) {
    i++;
    const query = `${candidate.nome} ${candidate.citta} ${candidate.provincia} poligono tiro`;
    let place: PlacesResult;
    try {
      place = await searchPlace(apiKey, query);
    } catch (err) {
      console.error(`  [${i}/${slice.length}] ERRORE su "${candidate.nome}": ${(err as Error).message}`);
      place = { found: false };
    }
    const { azione, confidenza } = classify(candidate, place);
    console.log(`  [${i}/${slice.length}] ${candidate.nome} (${candidate.citta}) → ${azione}`);

    lines.push(
      [
        candidate.regione, candidate.tipo, candidate.nome, candidate.citta, candidate.provincia,
        candidate.telefono, candidate.sito, candidate.email,
        place.found ? 'si' : 'no', place.name ?? '', place.formattedAddress ?? '',
        place.businessStatus ?? '', place.rating?.toString() ?? '', place.userRatingsTotal?.toString() ?? '',
        azione, confidenza,
      ]
        .map((v) => csvEscape(String(v)))
        .join(','),
    );

    // Rispetta i rate limit di Google Places (max ~10 req/s consentite, stiamo larghi).
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  writeFileSync(outPath, lines.join('\n'), 'utf-8');
  console.log(`\nReport scritto in ${outPath}`);
  console.log('Nessuna scrittura sul database: rivedi il CSV a mano prima di importare qualsiasi riga.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
