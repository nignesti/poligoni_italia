# Poligoni Italia — codice

Monorepo TypeScript. Documenti di riferimento nella cartella superiore:

- `../Business_Plan_Poligoni_Italia_v2.md` — fonte unica per **cosa** si costruisce e in che ordine
- `../Piano_Sviluppo_App.md` — piano tecnico: architettura, modello dati, API, task

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

## Stato

| Pacchetto | Stato |
|---|---|
| `packages/core` | ✅ Completo e testato al 100% |
| `packages/schemas` | ⬜ Da fare — task 5 |
| `packages/db` | ⬜ Da fare — task 2-3 |
| `packages/api-client` | ⬜ Da fare — task 22 |
| `apps/web` | ⬜ Da fare — task 8 |
| `apps/mobile` | ⬜ Da fare — task 21 |

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
