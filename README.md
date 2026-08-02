# Poligoni Italia

Layer di discovery e prenotazione nazionale per i poligoni di tiro italiani —
oggi assente: ogni poligono ha il proprio sito, gestionale e modulo di
prenotazione, senza alcun punto di accesso unico e verificato. Dettagli
completi in [`Docs/Business_Plan_Poligoni_Italia_v2.md`](Docs/Business_Plan_Poligoni_Italia_v2.md).

## Struttura del repo

```
app/            monorepo pnpm — tutto il codice (vedi app/README.md per setup)
Docs/           documentazione business e prodotto
Database/       fonte dati del censimento (script scraping, dump SQL)
graphify-out/   grafo di conoscenza del progetto, locale e rigenerabile
CLAUDE.md       istruzioni di progetto per Claude Code
```

Il codice vive dentro `app/`, non alla radice del repo: `app/` contiene il
proprio `pnpm-workspace.yaml` ed è la vera root del progetto JavaScript/TypeScript.
La radice del repo raccoglie codice, dati e documentazione business come
elementi separati e alla pari.

### `app/` — monorepo

- `apps/web` — sito pubblico e dashboard `(admin)`/`(gestore)`, Next.js (App Router)
- `apps/mobile` — app tiratore, Vite + React, consuma le API REST di `apps/web`
- `packages/core` — logica di dominio pura (limiti munizioni, scadenze GPG, prenotazioni), testata al 100%
- `packages/db` — schema Drizzle, migrazioni, query
- `packages/schemas` — tipi condivisi (Zod)
- `packages/ui` — componenti condivisi

Setup, comandi e stato dei pacchetti: [`app/README.md`](app/README.md).

### `Docs/` — documentazione

| File | Contenuto |
|---|---|
| `Business_Plan_Poligoni_Italia_v2.md` | Cosa si costruisce, per chi, e perché — fonte unica per le priorità di prodotto |
| `Piano_Sviluppo_App.md` | Piano tecnico: architettura, modello dati, API, roadmap task |
| `RICERCA_MERCATO.md` | Mappatura mercato europeo — materiale grezzo, non ancora verificato con lo stesso rigore delle fonti italiane |
| `BILLING_IMPLEMENTATION.md` | Stato di implementazione del modulo fatturazione/abbonamenti |
| `TARGETFUN_IMPORT_LOG.md` | Log dell'import dati da Targetfun (censimento strutture) |

Se leggendo il codice viene voglia di cambiare una priorità, la modifica va
fatta nel business plan e poi riflessa nel codice — non decisa lì.

### `Database/`

Fonte dati non rigenerabile del censimento strutture: script di scraping
(`maps_scraping.py`), dump SQL (`poligoni_italia.sql`) e ricerca di supporto.

## Principio cardine: mai inventare dati

Se un dato non è verificato, resta vuoto o nullo — mai stimato o generato
plausibile. Vale per orari, limiti normativi, numero di strutture censite,
qualunque cifra esposta all'utente. Dettagli ed esempi concreti in
[`CLAUDE.md`](CLAUDE.md).
