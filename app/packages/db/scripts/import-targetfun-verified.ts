/**
 * Importa i 72 candidati validati (CANDIDATO VALIDO) dai CSV di verifica
 * nel database locale e Supabase.
 *
 * Script lancia un DRY RUN di default. Per committare nel DB reale:
 *   DATABASE_URL=... pnpm exec tsx scripts/import-targetfun-verified.ts --commit
 *
 * Dati estratti da targetfun-verify-batch{1,2}.csv
 * Fonte di autorità: nome + indirizzo su Google Places, con rating > 4.0
 */
import { readFileSync } from 'node:fs';
import { parse as csvParse } from 'csv-parse/sync';
import postgres from 'postgres';
import { v4 as uuidv4 } from 'uuid';

interface VerifyRow {
  regione: string;
  tipo: string;
  nome_targetfun: string;
  citta: string;
  provincia: string;
  cap: string;
  telefono: string;
  sito_targetfun: string;
  email: string;
  azione_consigliata: string;
  nome_google: string;
  indirizzo_google: string;
  rating: string;
}

interface RangeInsert {
  id: string;
  slug: string;
  name: string;
  type: 'tsn' | 'privato' | 'tiro_a_volo' | 'dinamico' | 'long_range' | string;
  address: string;
  comune: string;
  provincia: string;
  regione: string;
  cap: string;
  location: string; // WKT format: POINT(lng lat)
  phone: string | null;
  email: string | null;
  website: string | null;
  data_source: string;
  status: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapTipoToRangeType(
  tipo: string,
): 'tsn' | 'privato' | 'tiro_a_volo' | 'dinamico' | 'long_range' | string {
  const t = tipo.toUpperCase();
  if (t.includes('UITS') || t.includes('TSN')) return 'tsn';
  if (t.includes('VOLO')) return 'tiro_a_volo';
  if (t.includes('DINAMICO') || t.includes('TACTICAL')) return 'dinamico';
  if (t.includes('LONG_RANGE')) return 'long_range';
  return 'privato';
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL non impostata.');
    process.exitCode = 1;
    return;
  }

  const commit = process.argv.includes('--commit');

  // Leggi entrambi i CSV
  const batch1Data = readFileSync(
    '/Users/nicco/Developer/Poligoni_Italia/app/packages/db/scripts/out/targetfun-verify-batch1.csv',
    'utf-8',
  );
  const batch2Data = readFileSync(
    '/Users/nicco/Developer/Poligoni_Italia/app/packages/db/scripts/out/targetfun-verify-batch2.csv',
    'utf-8',
  );

  const rows1: VerifyRow[] = csvParse(batch1Data, { columns: true });
  const rows2: VerifyRow[] = csvParse(batch2Data, { columns: true });

  // Filtra solo CANDIDATO VALIDO
  const validRows = [
    ...rows1.filter((r) => r.azione_consigliata.includes('CANDIDATO VALIDO')),
    ...rows2.filter((r) => r.azione_consigliata.includes('CANDIDATO VALIDO')),
  ];

  console.log(`Found ${validRows.length} valid candidates to import.`);

  // Placeholder coordinates per provincia (centro di provincia approssimato)
  const provinciaCoords: { [key: string]: [number, number] } = {
    AQ: [42.352, 13.398], // L'Aquila
    CH: [42.35, 14.167], // Chieti
    PE: [42.461, 14.215], // Pescara
    TE: [42.659, 13.235], // Teramo
    PZ: [40.602, 15.8], // Potenza
    MT: [40.666, 16.603], // Matera
    CS: [39.293, 16.24], // Cosenza
    CZ: [38.889, 16.59], // Catanzaro
    KR: [37.085, 17.118], // Crotone
    RC: [38.113, 15.651], // Reggio Calabria
    VV: [38.676, 16.086], // Vibo Valentia
    NA: [40.856, 14.269], // Napoli
    BN: [41.128, 14.989], // Benevento
    CE: [41.136, 14.033], // Caserta
    SA: [40.678, 14.776], // Salerno
    BO: [44.494, 11.342], // Bologna
    FE: [44.838, 11.62], // Ferrara
    MO: [44.648, 10.928], // Modena
    PR: [44.798, 10.328], // Parma
    PC: [45.052, 9.704], // Piacenza
    RA: [44.417, 12.201], // Ravenna
    FC: [44.217, 12.039], // Forlì-Cesena
    RN: [43.939, 12.583], // Rimini
    PN: [45.951, 12.648], // Pordenone
    UD: [46.063, 13.227], // Udine
    TS: [45.65, 13.778], // Trieste
    FR: [41.3, 13.311], // Frosinone
    LT: [41.462, 13.134], // Latina
    RI: [42.412, 12.649], // Rieti
    RM: [41.9, 12.5], // Roma
    VT: [42.416, 12.108], // Viterbo
    GE: [44.405, 8.946], // Genova
    IM: [43.881, 8.245], // Imperia
    SV: [44.311, 8.481], // Savona
    SP: [43.343, 9.82], // La Spezia
    BG: [45.698, 9.67], // Bergamo
    BS: [45.541, 10.21], // Brescia
    CO: [45.812, 9.087], // Como
    CR: [45.329, 10.25], // Cremona
    LO: [45.31, 9.503], // Lodi
    MB: [45.628, 9.294], // Monza e Brianza
    MI: [45.465, 9.19], // Milano
    MN: [45.158, 10.797], // Mantova
    PV: [45.184, 9.157], // Pavia
    SO: [46.17, 10.287], // Sondrio
    VA: [45.812, 8.84], // Varese
    AN: [43.598, 13.505], // Ancona
    AP: [43.152, 13.5], // Ascoli Piceno
    FM: [43.176, 13.742], // Fermo
    MC: [43.266, 13.485], // Macerata
    PU: [43.722, 12.6], // Pesaro e Urbino
    AR: [43.464, 11.878], // Arezzo
    FI: [43.769, 11.255], // Firenze
    GR: [42.759, 11.112], // Grosseto
    LI: [43.571, 10.317], // Livorno
    LU: [43.84, 10.507], // Lucca
    MS: [44.031, 10.288], // Massa-Carrara
    PI: [43.716, 10.396], // Pisa
    PO: [43.877, 11.622], // Prato
    PT: [51.837, 10.75], // Pistoia
    SI: [43.318, 11.93], // Siena
    BZ: [46.497, 11.337], // Bolzano
    TN: [46.065, 11.127], // Trento
    PG: [43.105, 12.389], // Perugia
    TR: [42.481, 12.644], // Terni
    AO: [45.736, 7.315], // Aosta
    AL: [44.925, 8.615], // Alessandria
    AT: [44.881, 8.317], // Asti
    BI: [45.562, 8.23], // Biella
    CN: [44.401, 7.59], // Cuneo
    NO: [45.432, 8.627], // Novara
    TO: [45.07, 7.687], // Torino
    VC: [45.319, 8.428], // Vercelli
    BA: [41.129, 16.869], // Bari
    BT: [41.272, 16.284], // Barletta-Andria-Trani
    BR: [40.636, 17.947], // Brindisi
    FG: [41.463, 15.549], // Foggia
    LE: [40.356, 18.176], // Lecce
    TA: [40.478, 17.25], // Taranto
    CA: [39.217, 9.118], // Cagliari
    NU: [40.336, 9.509], // Nuoro
    OR: [39.892, 8.635], // Oristano
    OT: [40.851, 8.549], // Olbia-Tempio
    SU: [39.777, 8.542], // Sud Sardegna
    VS: [39.833, 8.667], // Medio Campidano (if exists)
    SS: [40.629, 8.265], // Sassari
    AG: [37.311, 13.583], // Agrigento
    CL: [37.271, 13.959], // Caltanissetta
    CT: [37.502, 15.087], // Catania
    EN: [37.541, 14.27], // Enna
    ME: [38.191, 15.556], // Messina
    PA: [38.116, 13.361], // Palermo
    RG: [36.944, 14.729], // Ragusa
    SR: [37.075, 15.273], // Siracusa
    TP: [37.912, 12.437], // Trapani
    EE: [0, 0], // Fallback
  };

  const insertRows: RangeInsert[] = validRows.map((row) => {
    const slug = slugify(`${row.nome_targetfun}-${row.citta}`);
    const coords = provinciaCoords[row.provincia] || [0, 0];
    // Location in PostGIS format: SRID=4326 format
    const location = `POINT(${coords[1]} ${coords[0]})`;
    return {
      id: uuidv4(),
      slug,
      name: row.nome_targetfun,
      type: mapTipoToRangeType(row.tipo),
      address: (row.indirizzo_google || '').trim(),
      comune: row.citta,
      provincia: row.provincia,
      regione: row.regione,
      cap: (row.cap || '').trim() || null,
      location,
      phone: (row.telefono || '').trim() || null,
      email: (row.email || '').trim() || null,
      website: (row.sito_targetfun || '').trim() || null,
      data_source: 'targetfun_verified_batch',
      status: 'censito',
    };
  });

  if (!commit) {
    console.log('\n=== DRY RUN (no database changes) ===\n');
    console.log('First 5 rows to be imported:');
    console.table(insertRows.slice(0, 5));
    console.log(`\nTotal to import: ${insertRows.length}`);
    console.log('\nTo commit to database, run with --commit flag:');
    console.log(
      '  DATABASE_URL=... pnpm exec tsx scripts/import-targetfun-verified.ts --commit',
    );
    return;
  }

  // Commit to database
  const sql = postgres(databaseUrl);
  try {
    console.log(`\n=== IMPORTING ${insertRows.length} RANGES ===\n`);

    let inserted = 0;
    let skipped = 0;

    for (const row of insertRows) {
      try {
        await sql`
          INSERT INTO ranges (
            id, slug, name, type, address, comune, provincia, regione, cap,
            location, phone, email, website, data_source, status, created_at, updated_at
          ) VALUES (
            ${row.id}, ${row.slug}, ${row.name}, ${row.type}, ${row.address},
            ${row.comune}, ${row.provincia}, ${row.regione}, ${row.cap},
            ST_GeogFromText(${row.location}),
            ${row.phone}, ${row.email}, ${row.website}, ${row.data_source},
            ${row.status}, now(), now()
          )
          ON CONFLICT (slug) DO NOTHING
        `;
        inserted++;
      } catch (err) {
        if (
          (err as Error).message.includes('violates unique constraint') ||
          (err as Error).message.includes('ON CONFLICT')
        ) {
          skipped++;
        } else {
          console.error(`Error inserting ${row.name}:`, err);
          throw err;
        }
      }
    }

    console.log(`✅ Inserted: ${inserted}`);
    console.log(`⏭️  Skipped (duplicates): ${skipped}`);
    console.log(`\n✨ Import complete!`);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
