# Poligoni Italia — codice

Monorepo TypeScript. Documenti di riferimento in `../Docs/`:

- `../Docs/Business_Plan_Poligoni_Italia_v2.md` — fonte unica per **cosa** si costruisce e in che ordine
- `../Docs/Piano_Sviluppo_App.md` — piano tecnico: architettura, modello dati, API, task; leggere gli "Aggiornamento del piano" in fondo prima del resto, superano parti del corpo del documento

Se leggendo il codice viene voglia di cambiare una priorità, la modifica va fatta nel
business plan e poi riflessa qui. Non decisa qui.

## Requisiti

Node ≥ 20 e pnpm 11 (`corepack enable pnpm`).

## Database locale PostgreSQL

Il backend è stato portato su PostgreSQL locale. La connessione di default è:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/poligoni_italia
```

Se il tuo ruolo locale o la password differiscono, aggiorna il valore nei file:

- `app/packages/db/.env`
- `app/apps/web/.env.local`

Prima di lanciare l'app, crea il database e l'estensione PostGIS:

```bash
createdb poligoni_italia
psql -d poligoni_italia -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

Quindi applica lo schema e i seed:

```bash
cd app
pnpm --filter @poligoni/db db:push
pnpm --filter @poligoni/db db:seed
```

## Comandi

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm coverage
```

## Stato (03/08/2026)

| Pacchetto | Stato |
|---|---|
| `packages/core` | ✅ Completo e testato al 100% |
| `packages/schemas` | ✅ In uso, tipi condivisi via Zod |
| `packages/db` | ✅ Schema, migrazioni, query — in uso da web e admin |
| `packages/api-client` | ⬜ Mai costruito, deliberatamente: l'app mobile parla direttamente con Supabase (RLS), non con `/api/v1` — vedi Piano_Sviluppo_App.md, Aggiornamento 01/08/2026 §1 |
| `apps/web` | ✅ Sito pubblico + dashboard `(admin)` e `(gestore)`, entrambe su dati reali |
| `apps/mobile` | ✅ Web app Vite/React (non ancora Expo/nativo — vedi Piano, Aggiornamento 01/08/2026 §2) |

## `packages/core`

Logica di dominio pura: nessuna dipendenza esterna, nessun I/O, nessun accesso a rete
o database. Contiene le regole che devono comportarsi in modo identico su web, mobile
e server.

| Modulo | Cosa contiene | Perché è testato al 100% |
|---|---|---|
| `ammo` | Limiti di detenzione art. 97 TULPS, inventario derivato dai movimenti | Un errore fornisce a un utente un'informazione sbagliata su un obbligo con conseguenze sanzionatorie |
| `gpg` | Scadenze quadrimestrali delle esercitazioni per guardie giurate | Calcola una data da cui dipende una sanzione |
| `ballistics` | Statistiche del gruppo di tiro | Puro e deterministico: non c'è ragione di non testarlo |
| `booking` | Slot, disponibilità, sovrapposizioni | Doppie prenotazioni |
| `documents` | Scadenze documentali | Avvisi su documenti la cui scadenza blocca l'accesso al poligono |

La soglia del 100% è applicata dalla CI (`.github/workflows/verify.yml`). Non è un
obiettivo di stile: è il perimetro di codice in cui un difetto danneggia l'utente.

### Due punti da leggere prima di modificare

**`ammo` aggrega per categoria, non per calibro.** Il limite di 200 cartucce vale sulla
somma di tutti i calibri per arma corta, non su ciascuno. È l'errore più facile da
commettere e il più grave; c'è un test dedicato.

**`gpg` contiene un'assunzione da verificare.** La decorrenza del ciclo quadrimestrale
dalla data sul porto d'armi è documentata da fonti di sezione ma non confermata da un
istituto di vigilanza. Va verificata prima del rilascio (Piano_Sviluppo_App.md §5.3).

## Cosa non c'è, deliberatamente

- **Numeri di matricola delle armi**: mai archiviati, in nessuna forma. Un archivio
  violato di chi detiene armi e dove abita è un elenco operativo per un furto
  (BP §3.5.8).
- **Certificazioni**: il contatore munizioni calcola, non certifica; il check-in mostra,
  non verifica. Le avvertenze sono definite in `core` e importate ovunque, così che non
  possano essere dimenticate in una schermata.
