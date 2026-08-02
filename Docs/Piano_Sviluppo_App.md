# PIANO DI SVILUPPO — POLIGONI ITALIA
## Documento tecnico esecutivo — v1.0 — 29 luglio 2026

> Documento operativo interno. Complementare a `Business_Plan_Poligoni_Italia_v2.md`, che resta la fonte unica per **cosa** si costruisce e **in che ordine**. Questo documento possiede solo il **come**.

> ⚠️ **Aggiornamento 01/08/2026 — leggere prima del resto.** A pochi giorni dalla stesura di questo documento, la velocità di sviluppo osservata ha reso obsoleto il modello di budget a giornate/settimane-uomo e alcune decisioni di architettura sono state prese scrivendo codice invece che sulla carta. Vedi **"Aggiornamento del piano — 01/08/2026"** in fondo al documento per il quadro completo: quella sezione ha priorità su §1.2, sulla riga "App mobile" di §2.1, su §12 e su §14 ovunque siano in contraddizione.
>
> ⚠️ **Aggiornamento 03/08/2026.** Il blocco 1 del backlog per priorità definito il 01/08 ("Bersagli e punteggi") risulta completato — il blocco attivo è ora il 2 ("SEO / acquisizione / contenuti"). Dashboard gestore (§7.3) passata da mock a dati reali; nuova dashboard admin non prevista dal piano originale. Vedi **"Aggiornamento del piano — 03/08/2026"** in fondo al documento.

---

## INDICE

| § | Sezione |
|---|---|
| 0 | Regole d'ingaggio tra i due documenti |
| 1 | Vincoli e budget reale |
| 2 | Decisioni di architettura |
| 3 | Struttura del monorepo |
| 4 | Modello dati |
| 5 | Logica di dominio condivisa |
| 6 | API |
| 7 | Schermate e superfici |
| 8 | Sicurezza e compliance tecnica |
| 9 | Ambienti, deploy e CI |
| 10 | Strategia di test |
| 11 | Strategia di pubblicazione sugli store |
| 12 | Scomposizione in task per trimestre |
| 13 | Rischi tecnici |
| 14 | Decisioni rimandate |

---

# 0. REGOLE D'INGAGGIO TRA I DUE DOCUMENTI

Il rischio di due documenti separati è che divergano. Si evita con una regola sulla proprietà delle decisioni.

| Decisione | Documento proprietario |
|---|---|
| Quali funzionalità, in quale fase, con quale priorità | **Business plan** — §3.2, §3.5.6, §11.2, §11.3 |
| Budget in settimane-uomo | **Business plan** — Allegato C |
| Vincoli di compliance non negoziabili | **Business plan** — §14.5 (check-in), §3.5.8 (matricole), §14.2 (dati sanitari) |
| Metriche da strumentare | **Business plan** — §9.2 |
| Stack, architettura, schema dati, API, deploy, test | **Questo documento** |
| Scomposizione in task e stime | **Questo documento** |

**Se leggendo questo piano viene voglia di cambiare una priorità, la modifica va fatta nel business plan e poi riflessa qui.** Non decisa qui.

---

# 1. VINCOLI E BUDGET REALE

## 1.1 I vincoli che comandano ogni scelta

| Vincolo | Valore | Conseguenza progettuale |
|---|---|---|
| Sviluppatore | **1** | Nessuna architettura che richieda coordinamento. Nessun servizio che vada gestito separatamente |
| Tempo disponibile | **~15-16 h/settimana**, frammentate su turni ciclici | Task da 1-3 giorni, mai da due settimane. Deve essere possibile chiudere qualcosa in una sessione da 4 ore |
| Cassa Anno 1 | **~10.400 €** totali, di cui ~1.000 € per infrastruttura e servizi | Solo servizi con piano gratuito o a consumo. Nessun costo fisso significativo prima dei ricavi |
| Canale B2C principale | **SEO su intento locale** (BP §5.6) | Le pagine struttura **devono** essere renderizzate lato server e indicizzabili. Non è negoziabile: è il motore di acquisizione |
| Dati trattati | Documenti sanitari, munizioni detenute | Cifratura, minimizzazione, DPIA. Vedi §8 |
| Store | **App nativa dal lancio** (scelta del fondatore) | L'approvazione entra nel percorso critico. Vedi §11 |

## 1.2 Il budget e il conto che non torna

> ⚠️ **Superato dall'Aggiornamento 01/08/2026** (in fondo al documento). Il modello a giornate/settimane-uomo di questa sezione e di §12 non riflette più la velocità reale osservata: l'intero §1.2 va letto come contesto storico del perché si è arrivati alla decisione, non come vincolo ancora attivo.

Il business plan (Allegato C) assegna **62 settimane-uomo** su 78 settimane di calendario, pari a ~16 h/settimana, nell'ipotesi di **PWA-first con app nativa rinviata**.

La scelta di sviluppare **nativo dal lancio** modifica il conto. Va detto con precisione:

| | Settimane |
|---|---|
| Budget del business plan (PWA-first, Spotter rinviato) | 62 |
| App nativa costruita separatamente (stima lorda BP) | +8 |
| **Totale ingenuo** | **70** → 17,9 h/settimana, **fuori budget del 20%** |

Due correzioni riportano il piano dentro i limiti, e sono la ragione delle scelte architetturali di §2:

**Correzione 1 — il monorepo TypeScript riduce il costo marginale del nativo da 8 a ~5 settimane.** Con logica di dominio, client API, schemi di validazione e tipi condivisi tra web e mobile, l'app nativa non riparte da zero: implementa solo le proprie schermate. Le 3 settimane risparmiate non sono un'ottimizzazione teorica, sono la ragione principale per cui si sceglie questa architettura.

**Correzione 2 — lo Spotter esce dal piano a 18 mesi.** Il business plan lo colloca in T6 (5 settimane), ma §13.3 dello stesso documento riconosce che è inutile prima di una massa critica di utenti che a 18 mesi non ci sarà. Va ad Anno 2.

| | Settimane | Ore/settimana |
|---|---|---|
| **Budget finale di questo piano** | **64** | **16,4** |

**16,4 ore a settimana è il tetto, non un obiettivo.** Non c'è margine: qualsiasi funzionalità aggiunta va compensata togliendone un'altra. Se il tempo reale disponibile scende sotto le 14 ore per più di un mese, la prima cosa da tagliare è l'app nativa in T3, ripiegando su PWA — la decisione va presa entro il mese 7, non al mese 12.

---

# 2. DECISIONI DI ARCHITETTURA

Ogni decisione è motivata rispetto ai vincoli di §1.1, non rispetto a criteri astratti di qualità.

## 2.1 Quadro d'insieme

| Livello | Scelta | Motivazione dominante |
|---|---|---|
| Linguaggio | **TypeScript ovunque** | Competenza del fondatore. Un solo linguaggio elimina il costo di contesto tra web, mobile e backend |
| Web pubblico + dashboard B2B | **Next.js (App Router)** | Rendering lato server necessario per la SEO delle schede struttura, che è il canale di acquisizione principale |
| App mobile | **Expo (React Native)** | Riusa React e il core condiviso. EAS Build/Submit gestisce firma e pubblicazione senza Xcode locale. **EAS Update permette di correggere bug senza passare dalla review** |
| Backend | **Route handlers Next.js**, `/api/v1`, REST + Zod | Un solo deploy, un solo repository, nessun servizio separato da gestire |
| Database | **PostgreSQL + PostGIS** | Query geospaziali (ricerca per raggio) e transazioni ACID sulle prenotazioni |
| Piattaforma dati | **Supabase (regione EU — Francoforte)** | Postgres gestito con PostGIS, autenticazione, storage file e Row Level Security in un solo servizio. Per un fondatore unico vale più di qualsiasi guadagno di purezza architetturale |
| ORM | **Drizzle** | Tipizzazione forte con via di fuga verso SQL nativo, indispensabile per PostGIS. Prisma gestisce male i tipi geografici |
| Pagamenti | **Stripe** | Come da BP. Nessun dato di carta transita dai nostri sistemi |
| Hosting web | **Vercel** | Integrazione nativa con Next.js, piano gratuito sufficiente ai volumi Anno 1 |
| Notifiche push | **Expo Push** | Gratuito, sufficiente. Migrazione ad APNs/FCM diretti solo se necessario |
| Errori | **Sentry** | Piano gratuito. Per uno sviluppatore unico, sapere che qualcosa si è rotto prima che lo segnali un utente vale più di molte funzionalità |
| Analytics | **PostHog Cloud EU** | Strumenta le metriche di BP §9.2. Regione EU per coerenza GDPR |

> ⚠️ **Righe superate dall'Aggiornamento 01/08/2026**: "App mobile" (l'app costruita finora è una web app Vite/React, non Expo — il nativo resta l'obiettivo ma parte solo dopo i blocchi bersagli e SEO) e "Backend" per i dati personali (l'app mobile parla direttamente con Supabase, non con `/api/v1` — vedi anche la motivazione REST qui sotto, ora superata per lo stesso motivo).

## 2.2 Le tre decisioni che meritano una motivazione estesa

### REST versionato, non tRPC

> ⚠️ **Superato dall'Aggiornamento 01/08/2026.** La motivazione resta valida in astratto, ma nella pratica l'app mobile non passa da `/api/v1` per i dati personali: legge/scrive Supabase direttamente, con RLS come unico livello di protezione. `packages/api-client` non è mai stato costruito. È stato formalizzato come scelta definitiva, non come debito da ripagare — vedi l'Aggiornamento per il ragionamento completo.

tRPC darebbe tipizzazione end-to-end senza scrivere contratti, ed è la scelta naturale in un monorepo TypeScript. **Va evitato comunque**, per una ragione specifica delle app mobili: tRPC accoppia strettamente le versioni di client e server, mentre un'app pubblicata sugli store resta installata in versioni vecchie per mesi. Un utente che non aggiorna avrebbe un'app rotta a ogni modifica del backend.

Si adotta **REST versionato sotto `/api/v1`**, con schemi **Zod condivisi** tra client e server: si ottiene comunque la validazione e i tipi derivati, senza l'accoppiamento. Quando servirà una modifica incompatibile, nascerà `/api/v2` e la `v1` resterà viva finché ci sono client vecchi.

### Un monolite modulare, non microservizi

Il business plan (§12.2, rischio 13) classifica la scalabilità tecnica come rischio **basso** e nota che l'architettura a microservizi proposta dalle revisioni sarebbe una complessità che consuma tempo senza risolvere un problema esistente.

Il conto conferma: 110.000 prenotazioni all'anno in Anno 3 sono ~12 all'ora di picco. Un singolo processo Node su Postgres gestisce tre ordini di grandezza in più. **Il collo di bottiglia di questo progetto non sarà mai il throughput: sarà il tempo dello sviluppatore.**

L'unica cautela sensata è la **modularità interna**: il codice è organizzato per dominio (`ranges`, `bookings`, `diary`, `billing`) con confini netti, così che se un giorno servisse estrarre qualcosa, sia possibile. È gratis; i microservizi no.

### Supabase invece di infrastruttura assemblata

Assemblare Postgres gestito, un provider di autenticazione, uno storage S3 e le policy di accesso significa quattro fornitori, quattro configurazioni, quattro fatture e quattro punti di rottura. Supabase li fornisce insieme, con **Row Level Security** applicata a livello di database — che per dati sensibili come questi è una rete di sicurezza reale: anche un errore applicativo non espone i dati di un altro utente.

Il rischio di dipendenza da un fornitore esiste ma è contenuto: sotto c'è Postgres standard, e una migrazione futura richiederebbe di sostituire autenticazione e storage, non di riscrivere l'applicazione.

---

# 3. STRUTTURA DEL MONOREPO

Gestione con **pnpm workspaces**. Nessun orchestratore di build nella fase iniziale: si aggiunge Turborepo solo se i tempi di build diventano fastidiosi.

```
poligoni-italia/
├── apps/
│   ├── web/                 Next.js — sito pubblico SEO + dashboard B2B
│   │   ├── app/
│   │   │   ├── (public)/    Ricerca, schede struttura, guide
│   │   │   ├── (gestore)/   Dashboard B2B
│   │   │   └── api/v1/      Route handlers = il backend
│   │   └── ...
│   └── mobile/              Expo — app tiratore iOS/Android
│
├── packages/
│   ├── core/                Logica di dominio pura, zero dipendenze
│   │   ├── ammo/            Limiti art. 97 TULPS
│   │   ├── ballistics/      Statistiche del gruppo
│   │   ├── gpg/             Scadenze quadrimestrali
│   │   ├── booking/         Sovrapposizioni, disponibilità
│   │   └── documents/       Scadenze documentali
│   ├── schemas/             Schemi Zod = contratto API condiviso
│   ├── db/                  Drizzle: schema, migrazioni, query
│   ├── api-client/          Client HTTP tipizzato, usato da web e mobile
│   └── ui/                  Solo token di design condivisi (colori, spaziature)
│
└── docs/
```

**Nota su `packages/ui`.** Non si condividono componenti tra Next.js e React Native: sono ambienti di rendering diversi e ogni tentativo di unificarli costa più di quanto renda. Si condividono solo i **token** (colori, tipografia, spaziature), così che le due superfici si assomiglino senza accoppiarsi.

**Nota su `packages/core`.** È il pacchetto più importante del repository: contiene le regole che devono essere identiche ovunque e che, se sbagliate, hanno conseguenze legali. Non ha dipendenze esterne, è interamente puro e **interamente testato** (§10).

---

# 4. MODELLO DATI

PostgreSQL 15+ con estensione PostGIS. Chiavi primarie UUID v7 (ordinabili nel tempo, senza rivelare volumi). Tutte le tabelle hanno `created_at` e `updated_at`.

## 4.1 Dominio strutture

```sql
-- Anagrafica dei poligoni. È l'asset proprietario del progetto (BP §3.1).
ranges
  id                uuid pk
  slug              text unique          -- per URL SEO
  name              text
  type              range_type           -- tsn | privato | tiro_a_volo | dinamico | long_range
  address, comune, provincia, regione, cap
  location          geography(Point,4326)
  phone, email, website
  external_booking_url  text             -- poligoni con booking proprio (BP §2.5)
  management_software   text             -- GESTIT, TARGET… per le partnership (BP §7.2)
  status            range_status         -- censito | rivendicato | partner | inattivo
  data_source       text                 -- provenienza del dato
  verified_at       timestamptz          -- alimenta il KPI "dati aggiornati <30gg"
  verified_by       uuid → users

range_hours          -- orari ricorrenti, con stagionalità
  range_id, weekday, opens_at, closes_at, season_from, season_to

range_closures       -- chiusure straordinarie, gare, manutenzione
  range_id, date_from, date_to, reason, is_recurring

range_lines          -- le linee di tiro prenotabili
  range_id, name, distance_m, is_indoor, capacity
  calibers          text[]
  disciplines       discipline[]

range_pricing
  range_id, item, price_cents, unit, note

range_services       -- noleggio arma, istruttore, bersagli, munizioni
  range_id, service, available, price_cents

range_managers       -- chi può gestire la scheda
  user_id, range_id, role   -- proprietario | staff
```

**Indici critici:**
```sql
CREATE INDEX ON ranges USING GIST (location);          -- ricerca per raggio
CREATE INDEX ON ranges (provincia, status);            -- pagine provinciali SEO
CREATE INDEX ON ranges (verified_at);                  -- KPI freschezza dati
```

## 4.2 Dominio utenti e documenti

```sql
users
  id, email, phone, display_name, role   -- tiratore | gestore | gpg | admin
  home_location    geography(Point,4326) -- per suggerimenti, opzionale

user_documents
  user_id
  type             document_type   -- porto_armi_tav | porto_armi_caccia |
                                   -- porto_armi_difesa | porto_gpg |
                                   -- certificato_medico | tessera_federale
  expires_on       date            -- ⚠️ NEL CASO BASE SI SALVA SOLO QUESTO
  storage_ref      text NULL       -- riferimento al file cifrato, solo se l'utente
                                   -- carica l'immagine (§8.2)
  encrypted        boolean
```

> **Vincolo da BP §14.2 — minimizzazione.** Il certificato medico è dato sanitario ex art. 9 GDPR. Nel caso base si conserva **solo la data di scadenza**, che è sufficiente per l'unica funzione richiesta (l'avviso). L'immagine si carica solo su scelta esplicita dell'utente e solo cifrata lato client.

## 4.3 Dominio prenotazioni

```sql
bookings
  id, range_id, line_id, user_id
  slot_start, slot_end     timestamptz
  status                   -- richiesta | confermata | annullata | completata | no_show
  source                   -- app | web | manuale_gestore | telefono
  price_cents, fee_cents
  stripe_payment_intent_id
  qr_token                 text unique   -- per il check-in
  checked_in_at

booking_requests    -- fase T2: richieste senza prenotazione reale (BP §3.2)
  range_id, user_id, requested_for, message, forwarded_at, outcome
```

**Il vincolo più importante dell'intero schema** — previene il rischio 6 del business plan (doppia prenotazione):

```sql
ALTER TABLE bookings ADD CONSTRAINT no_overlap
  EXCLUDE USING GIST (
    line_id WITH =,
    tstzrange(slot_start, slot_end) WITH &&
  ) WHERE (status IN ('richiesta','confermata'));
```

Questo vincolo di esclusione rende la doppia prenotazione **impossibile a livello di database**, non improbabile a livello applicativo. È la differenza tra un sistema che funziona sotto carico e uno che funziona in demo. Le prenotazioni telefoniche inserite dal gestore passano dallo stesso vincolo, che è esattamente lo scenario di rischio descritto nel business plan.

## 4.4 Dominio diario — "Il Mio Tiro" (BP §3.5)

```sql
firearms
  id, user_id
  nickname          text     -- "la 92 di papà"
  type              -- pistola | revolver | carabina | fucile | avancarica
  caliber           text
  -- ⚠️ NESSUN numero di matricola. NESSUN documento di detenzione. (BP §3.5.8)

sessions
  id, user_id
  range_id          uuid NULL   -- null se poligono non censito
  booking_id        uuid NULL   -- valorizzato se auto-generata
  range_name_manual text NULL
  started_at, duration_min, distance_m
  auto_generated    boolean     -- KPI "% sessioni auto-generate"
  confirmed_by_user boolean     -- mai pubblicare una sessione non confermata
  notes

session_shots
  session_id, firearm_id, caliber, rounds_fired

ammo_inventory
  user_id, caliber
  category          ammo_category  -- arma_corta | arma_lunga_caccia | spezzone | polvere
  quantity          integer        -- pezzi, oppure grammi per la polvere
  UNIQUE (user_id, caliber, category)

ammo_movements      -- storico: l'inventario è la somma dei movimenti
  user_id, caliber, category
  delta             integer        -- positivo carico, negativo consumo
  reason            -- acquisto | consumo_sessione | ricarica | correzione | cessione
  session_id        uuid NULL
  occurred_at

targets
  id, session_id, firearm_id
  storage_ref       text           -- foto in Supabase Storage
  target_type       text           -- ISSF 25m, silhouette, generico
  distance_m
  scoring_mode      -- manuale | automatico (T6+, condizionato)

target_holes
  target_id, x_mm, y_mm, score numeric NULL

gpg_logbook         -- BP §3.5.5
  user_id
  porto_armi_expires_on  date      -- da cui si calcolano le tre scadenze
  institute_name         text NULL

gpg_exercises
  logbook_id, sequence   -- 1 | 2 | 3 nell'anno
  due_by, performed_at
  range_id, rounds_fired, score
  certified              boolean   -- la terza rilascia il patentino

maintenance_rules
  firearm_id, kind        -- pulizia | usura_canna | molla_recupero
  interval_rounds, last_done_at_rounds
```

**Nota di progetto sull'inventario munizioni.** `ammo_inventory` è una vista materializzata dei movimenti, non una tabella scritta direttamente. Il motivo è di responsabilità: se un utente contesta il conteggio — e su un dato con rilevanza penale può succedere — deve essere possibile ricostruire ogni variazione. Un contatore che si limita a incrementare e decrementare un numero non è verificabile.

## 4.5 Dati di riferimento (seed)

```sql
legal_ammo_limits    -- art. 97 TULPS, BP §3.5.4
  category            ammo_category pk
  max_quantity        integer
  declaration_from    integer NULL   -- soglia di obbligo di denuncia
  legal_reference     text
  note

-- Contenuto iniziale:
-- arma_corta          200     ref: art. 97 TULPS
-- arma_lunga_caccia  1500     ref: art. 97 TULPS
-- spezzone           1500     denuncia oltre 1000
-- polvere            2000 g   ref: art. 97 TULPS
```

I limiti stanno in tabella, non nel codice: una modifica normativa deve essere una riga di dati, non un rilascio dell'app — che sugli store richiederebbe giorni di review mentre l'utente vede un limite sbagliato.

---

# 5. LOGICA DI DOMINIO CONDIVISA (`packages/core`)

Le funzioni che devono comportarsi in modo identico su web, mobile e server. Sono pure, senza effetti collaterali, e interamente testate.

## 5.1 Limiti munizioni

```ts
type AmmoStatus = {
  category: AmmoCategory
  quantity: number
  limit: number
  percentUsed: number
  level: 'ok' | 'attenzione' | 'limite' | 'oltre'
  declarationRequired: boolean
  message: string
}

// Soglie: attenzione ≥80%, limite ≥100%, oltre >100%
export function evaluateAmmoLimits(
  inventory: AmmoInventory[],
  limits: LegalAmmoLimit[]
): AmmoStatus[]
```

Regole:
- Aggregazione **per categoria**, non per calibro: il limite di 200 vale sulla somma delle cartucce per arma corta, non su ciascun calibro. È l'errore più facile da commettere e il più grave;
- Lo spezzone genera `declarationRequired` oltre i 1.000 pezzi, con limite a 1.500;
- Ogni messaggio riporta il riferimento normativo e la formula di calcolo.

**Ogni superficie che mostra questi dati deve riportare l'avvertenza** prevista da BP §3.5.4: *"Strumento di ausilio al calcolo. Non costituisce certificazione di conformità: la responsabilità della detenzione resta del detentore."* La stringa è definita in `core` e importata ovunque, così che non possa essere dimenticata in una schermata.

## 5.2 Statistiche del gruppo

Nessun apprendimento automatico: geometria elementare sui fori marcati dall'utente.

```ts
type GroupStats = {
  shots: number
  centroid: { x: number; y: number }   // mm dal centro bersaglio
  meanRadius: number                    // media delle distanze dal centroide
  extremeSpread: number                 // massima distanza tra due fori
  windage: number                       // deriva = centroid.x
  elevation: number                     // alzo = centroid.y
  standardDeviation: number
  groupSizeMOA?: number                 // se la distanza è nota
}

export function computeGroupStats(
  holes: { x: number; y: number }[],
  distanceMeters?: number
): GroupStats
```

Definizioni adottate, dichiarate perché esistono convenzioni diverse:
- **Centroide**: media aritmetica delle coordinate;
- **Raggio medio**: media delle distanze euclidee di ciascun foro dal centroide;
- **Estensione (extreme spread)**: massima distanza fra due fori qualsiasi — confronto di tutte le coppie, accettabile perché i fori sono al massimo qualche decina;
- **Deriva e alzo**: scostamento del centroide dal centro del bersaglio, i valori che servono per correggere le tacche di mira;
- **MOA**: `(gruppo_mm / (distanza_m × 10)) × 34,38`.

## 5.3 Scadenze GPG

```ts
export function computeGpgSchedule(
  portoArmiExpiresOn: Date,
  year: number
): { sequence: 1 | 2 | 3; dueBy: Date }[]
```

Tre esercitazioni con cadenza quadrimestrale calcolate a partire dalla data di scadenza sul porto d'armi (BP §3.5.5). Genera gli avvisi a 60, 30 e 7 giorni.

> **Da confermare con un istituto di vigilanza prima del rilascio.** La cadenza quadrimestrale "a partire dalla data di scadenza riportata sul porto d'armi" è documentata da fonti di sezione, ma l'interpretazione pratica può variare. È una funzione che dà una data a qualcuno che rischia una sanzione: va verificata con chi la applica, non dedotta.

## 5.4 Altre funzioni

| Funzione | Cosa fa |
|---|---|
| `findAvailableSlots(line, rules, bookings, date)` | Calcolo della disponibilità |
| `detectOverlap(a, b)` | Sovrapposizione, in parallelo al vincolo di database |
| `computeDocumentAlerts(docs, today)` | Avvisi a 90/30/7 giorni |
| `computeSessionCost(session, pricing)` | Costo per sessione e per colpo |
| `maintenanceDue(firearm, rules, totalRounds)` | Manutenzione per numero di colpi |
| `distanceKm(a, b)` | Haversine, per l'ordinamento lato client |

---

# 6. API

REST sotto `/api/v1`. Autenticazione con JWT Supabase nell'header `Authorization`. Ogni corpo di richiesta e risposta è validato da uno schema Zod in `packages/schemas`.

## 6.1 Endpoint principali

**Pubblici** (senza autenticazione, con cache):
```
GET  /api/v1/ranges/search?lat&lng&radius&calibers&disciplines&indoor&openNow
GET  /api/v1/ranges/:slug
GET  /api/v1/ranges/province/:provincia
```

**Prenotazioni**:
```
GET    /api/v1/ranges/:id/availability?date&lineId
POST   /api/v1/bookings
GET    /api/v1/bookings/me
PATCH  /api/v1/bookings/:id/cancel
POST   /api/v1/booking-requests          # T2, senza prenotazione reale
```

**Diario**:
```
GET/POST/PATCH  /api/v1/sessions
POST            /api/v1/sessions/from-booking/:bookingId   # auto-generazione
GET/POST        /api/v1/firearms
GET             /api/v1/ammo/status                        # con valutazione limiti
POST            /api/v1/ammo/movements
POST            /api/v1/targets                            # upload
POST            /api/v1/targets/:id/holes                  # marcatura
GET             /api/v1/gpg/logbook
GET             /api/v1/stats/summary
```

**Gestore**:
```
GET/PATCH  /api/v1/manage/ranges/:id
PUT        /api/v1/manage/ranges/:id/hours
POST       /api/v1/manage/ranges/:id/closures
GET        /api/v1/manage/bookings?from&to
POST       /api/v1/manage/bookings          # inserimento prenotazione telefonica
POST       /api/v1/manage/checkin           # scansione QR
GET        /api/v1/manage/export?format=csv|ical
```

**Webhook**: `POST /api/v1/webhooks/stripe` — con verifica della firma e idempotenza.

## 6.2 Convenzioni

| Aspetto | Regola |
|---|---|
| Errori | `{ error: { code, message, details? } }`, codici stabili e documentati |
| Paginazione | Basata su cursore, mai su offset |
| Idempotenza | Header `Idempotency-Key` obbligatorio su POST che generano pagamenti |
| Limiti di frequenza | 60 req/min per utente, 300/min per IP sugli endpoint pubblici |
| Versione client | Header `X-App-Version`; il server può rispondere `426` per forzare l'aggiornamento di versioni troppo vecchie |
| Cache | `s-maxage=300` sulle ricerche pubbliche, invalidata alla modifica della struttura |

L'header di versione è la valvola di sicurezza dell'app nativa: permette di bloccare versioni che avessero un difetto grave, senza attendere che tutti aggiornino.

---

# 7. SCHERMATE E SUPERFICI

## 7.1 Web pubblico — Next.js, ottimizzato per SEO

| Rotta | Rendering | Ruolo |
|---|---|---|
| `/` | Statico | Ricerca, proposta di valore |
| `/poligoni/[regione]/[provincia]/[slug]` | **SSG + rigenerazione** | **La pagina più importante del progetto.** ~370 pagine indicizzabili: è il motore SEO |
| `/poligoni/[regione]/[provincia]` | SSG | Pagine provinciali, query locali |
| `/cerca` | Client | Mappa e filtri interattivi |
| `/guide/[slug]` | Statico | Contenuti di servizio (BP §6.3) |
| `/gestori` | Statico | Pagina di acquisizione B2B |

Sulle schede struttura: dati strutturati `LocalBusiness` + `SportsActivityLocation`, `sitemap.xml` generata dal database, meta tag e Open Graph per struttura, e la sezione "richiedi disponibilità" sempre presente anche per i poligoni non partner — è ciò che rende utile la pagina prima che esista un accordo.

## 7.2 App mobile — Expo

| Schermata | Fase | Note |
|---|---|---|
| Onboarding e accesso | T3 | OTP via e-mail, senza password |
| Ricerca e mappa | T3 | Con filtri tecnici |
| Scheda struttura | T3 | Orari, listino, calibri, servizi |
| Prenotazione (slot, conferma) | T3 | |
| Le mie prenotazioni + QR | T4 | |
| Pagamento | T4 | Apple Pay / Google Pay via Stripe |
| Documenti e scadenze | T4 | Con i vincoli di §8.2 |
| **Diario sessioni** | T4 | Con proposta di auto-compilazione post check-in |
| **Munizioni e limiti di legge** | T4 | Schermata a sé, raggiungibile in un tocco dalla home |
| Armi | T4 | Senza matricole |
| **Bersagli e marcatura** | T5 | Foto, pizzicare per zoomare, toccare i fori |
| **Statistiche** | T5 | Andamento per arma, calibro, distanza |
| **Libretto GPG** | T5 | Visibile solo agli utenti con ruolo GPG |
| Profilo, privacy, esportazione | T4 | Esportazione e cancellazione senza contattare il supporto |

**Il momento di progettazione più delicato è l'auto-generazione della sessione.** Dopo il check-in, l'app propone una notifica: *"Sessione al TSN di X registrata. Aggiungi colpi e risultati?"*. La sessione **non** viene creata in silenzio: `confirmed_by_user` esiste per questo. Un diario che si popola da solo di dati non verificati perde credibilità alla prima voce sbagliata, e il diario vive di credibilità.

## 7.3 Dashboard gestore — Next.js

| Schermata | Fase |
|---|---|
| Accesso e rivendicazione struttura | T2 |
| Scheda: dati, orari, listino, servizi | T2 |
| Chiusure e gare | T2 |
| Richieste in arrivo | T2 |
| Planner linee (vista settimanale) | T3 |
| Inserimento prenotazione telefonica | T3 |
| Check-in QR | T4 |
| Esportazione CSV/iCal | T5 |
| Insight di occupazione | T5 |

Progettata **per tablet e desktop**, non per telefono: il gestore la usa dal banco di segreteria. Il planner deve funzionare con il mouse e con il tocco, e deve restare leggibile su schermi vecchi — molte segreterie non hanno hardware recente.

---

# 8. SICUREZZA E COMPLIANCE TECNICA

Questa sezione attua i vincoli di BP §14 e §3.5.8. **Nessuna delle regole seguenti è negoziabile per ragioni di tempo.**

## 8.1 Regole assolute

| # | Regola | Verifica |
|---|---|---|
| 1 | **Nessun numero di matricola in database**, in nessuna tabella, in nessuna forma | Nessuna colonna dedicata; controllo in revisione dello schema |
| 2 | Nessun documento di detenzione o denuncia archiviato | Idem |
| 3 | I dati di detenzione non alimentano mai targeting pubblicitario | Nessun collegamento tra tabelle diario e analytics |
| 4 | Il check-in **mostra**, non **certifica** (BP §14.5) | Avviso non disattivabile nell'interfaccia gestore |
| 5 | Il contatore munizioni calcola, non certifica | Avvertenza da `core`, presente in ogni schermata |
| 6 | Row Level Security attiva su **tutte** le tabelle con dati personali | Test automatico in CI: nessuna tabella senza RLS |

## 8.2 Trattamento dei documenti

```
Caso base (raccomandato):    solo expires_on. Nessun file.
Caso esteso (facoltativo):   l'utente sceglie di caricare l'immagine
   → cifratura AES-GCM sul dispositivo, chiave derivata dalla passphrase
     dell'utente con Argon2
   → il server riceve e conserva solo il blob cifrato
   → il server non può decifrare, in nessuna circostanza
   → il gestore vede esito di validità e scadenza, mai il file
```

La conseguenza va accettata consapevolmente: **se l'utente perde la passphrase, i documenti sono irrecuperabili.** È il comportamento corretto per questi dati, e va spiegato nell'interfaccia al momento della scelta, non nascosto nelle condizioni d'uso.

## 8.3 Row Level Security

```sql
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sessions_own ON sessions
  USING (user_id = auth.uid());

ALTER TABLE ammo_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY ammo_own ON ammo_movements
  USING (user_id = auth.uid());

-- Il gestore vede le prenotazioni della propria struttura, non l'anagrafica
-- completa dei tiratori né alcun dato del diario
CREATE POLICY bookings_manager ON bookings
  USING (range_id IN (
    SELECT range_id FROM range_managers WHERE user_id = auth.uid()
  ));
```

**Nessuna politica dà a un gestore accesso a `sessions`, `firearms`, `ammo_*` o `targets`.** Il diario è privato dell'utente, punto. È una separazione che va scritta nello schema, non lasciata alla disciplina applicativa.

## 8.4 Altre misure

| Ambito | Misura |
|---|---|
| Trasporto | TLS ovunque, HSTS |
| Segreti | Variabili d'ambiente, mai nel repository. Rotazione annuale |
| Caricamenti | Tipo MIME verificato, dimensione massima, ridimensionamento sul dispositivo, URL firmati con scadenza |
| Metadati EXIF | **Rimossi dalle foto dei bersagli prima del caricamento** — contengono le coordinate GPS di dove è stata scattata la foto |
| Conservazione | Documenti cancellati alla scadenza + 30 giorni, con lavoro pianificato |
| Registro violazioni | Tabella `audit_log` per accessi ad ambiti sensibili |
| Backup | Giornalieri, con **prova di ripristino trimestrale** — un backup mai ripristinato non è un backup |

La rimozione dei metadati EXIF è una di quelle misure che sembrano marginali e non lo sono: le foto dei bersagli si scattano al poligono, e in molti casi a casa. Conservarne le coordinate significherebbe costruire, senza volerlo, un archivio degli indirizzi di persone che detengono armi.

---

# 9. AMBIENTI, DEPLOY E CI

## 9.1 Ambienti

| Ambiente | Web | Database | Note |
|---|---|---|---|
| Locale | `next dev` | Supabase CLI in Docker | Nessuna dipendenza da servizi remoti |
| Staging | Vercel preview | Progetto Supabase separato | Dati sintetici, mai copie di produzione |
| Produzione | Vercel | Supabase EU (Francoforte) | |

**Mai dati reali in staging.** Con dati sanitari e di detenzione non è una buona pratica: è un obbligo.

## 9.2 CI — GitHub Actions

```yaml
on: [push, pull_request]
jobs:
  verify:
    - pnpm typecheck            # tutti i pacchetti
    - pnpm lint
    - pnpm test                 # unitari, packages/core al 100%
    - pnpm test:integration     # API + database su Postgres di servizio
    - pnpm db:check             # nessuna migrazione fuori sincrono
    - pnpm security:rls         # nessuna tabella sensibile senza RLS
```

Il controllo `security:rls` è un test scritto una volta che interroga il catalogo di Postgres e fallisce se una tabella con `user_id` non ha RLS attiva. Costa mezza giornata e impedisce la classe di errori più pericolosa per questo progetto.

## 9.3 Rilasci

**Web**: continuo. `main` → produzione, ogni ramo → anteprima.

**Mobile**:
- `eas build --profile production` per iOS e Android
- `eas submit` per la pubblicazione
- **`eas update`** per le correzioni di codice JavaScript senza passare dalla review

L'ultimo punto è decisivo con la scelta nativa: la maggior parte dei difetti si corregge in ore invece che in giorni. Solo le modifiche al codice nativo richiedono una nuova build e una nuova review.

**Migrazioni database**: sempre retrocompatibili, applicate prima del rilascio del codice. Con un'app nativa in circolazione, una migrazione che rompe la compatibilità rompe le versioni installate — la regola vale sempre, ma qui non ammette eccezioni.

---

# 10. STRATEGIA DI TEST

Con 16 ore a settimana, puntare a un'alta copertura complessiva sarebbe una scelta autolesionista. Si testa in modo proporzionale al danno.

| Ambito | Copertura | Perché |
|---|---|---|
| **`packages/core/ammo`** | **100%, con casi limite** | Un errore qui dà a un utente un'informazione sbagliata su un obbligo con rilevanza penale. È il codice più delicato del progetto |
| **`packages/core/ballistics`** | **100%** | Puro, deterministico, facile da testare: non c'è ragione di non farlo |
| **`packages/core/gpg`** | **100%** | Calcola scadenze da cui dipende una sanzione |
| `packages/core/booking` | 100% | Doppie prenotazioni |
| **Vincolo di non sovrapposizione** | Test di integrazione con inserimenti concorrenti | Verifica che il database regga davvero, non che la funzione sia corretta |
| Webhook Stripe | Integrazione, con ripetizione e idempotenza | Errori qui costano denaro |
| Politiche RLS | Integrazione, un test per politica | Errori qui costano dati altrui |
| Rotte API | Un test del percorso felice ciascuna | Rete di sicurezza economica |
| Interfaccia web | **Un solo percorso end-to-end**: ricerca → scheda → prenotazione | Il resto non ripaga il costo di manutenzione |
| Interfaccia mobile | **Nessun test automatico** | Prova manuale su dispositivo prima di ogni rilascio |

Casi limite obbligatori per `ammo`: inventario vuoto; esattamente al limite; un pezzo oltre; più calibri nella stessa categoria (l'errore classico); spezzone tra 1.000 e 1.500; polvere in grammi; quantità negative da correzione manuale.

---

# 11. STRATEGIA DI PUBBLICAZIONE SUGLI STORE

La scelta di sviluppare nativo dal lancio porta l'approvazione sul percorso critico. Il business plan (§12.2, rischio 8) la classifica come rischio medio con probabilità 3 su 5. Va gestita attivamente.

## 11.1 Il principio: scoprire il problema quando costa poco

**Non attendere il mese 9 per la prima sottomissione.** Al termine di T2, quando esiste già il web pubblico ma l'app è solo un guscio con ricerca e schede, si sottomette una prima versione. Serve a una cosa sola: sapere se la categoria è accettata, mentre il costo di scoprirlo è di due giorni invece che di due mesi di lavoro a rischio.

## 11.2 Posizionamento

| Elemento | Scelta |
|---|---|
| Categoria | **Sport** (secondaria: Viaggi) |
| Descrizione | "Trova e prenota poligoni di tiro sportivo in Italia" |
| Classificazione età | 17+ |
| Materiale visivo | Strutture, linee di tiro, bersagli sportivi. **Nessuna arma in primo piano, nessuna estetica militare** |
| Assenti | Ogni riferimento a compravendita di armi o munizioni, qualsiasi collegamento a rivenditori |
| Presenti | Riferimento esplicito alla natura sportiva e alle federazioni |

Il **contatore munizioni** merita una cura particolare nella comunicazione allo store: va presentato per ciò che è, uno **strumento di conformità normativa** che aiuta l'utente a rispettare i limiti di legge italiani. È un argomento forte in fase di review — è una funzione che favorisce il rispetto della norma, non l'aggiramento.

## 11.3 Piano di riserva

Il web pubblico costruito in T2 **è** il piano di riserva, e non richiede lavoro aggiuntivo: se una delle due app venisse rifiutata, il servizio resta pienamente utilizzabile da browser mentre si negozia. Va mantenuto installabile come PWA per tutta la durata del piano, anche dopo la pubblicazione delle app native. Costa quasi nulla e toglie allo store il potere di fermare il progetto.

---

# 12. SCOMPOSIZIONE IN TASK PER TRIMESTRE

> ⚠️ **Superato dall'Aggiornamento 01/08/2026.** L'intera scomposizione in trimestri/giornate/settimane-uomo qui sotto era calibrata su ~15-16 ore/settimana di un solo sviluppatore umano. La velocità osservata è di un ordine di grandezza diversa, e il tracciamento del tempo non è più un vincolo che l'utente vuole seguire. Questa sezione resta utile come **elenco dei task e delle dipendenze tra loro**, non come stima di durata. Il backlog attivo, ordinato per priorità invece che per trimestre, è nell'Aggiornamento in fondo al documento.

Stime in giornate da ~5 ore effettive. **1 settimana-uomo = 4 giornate** (il tempo residuo è assorbito da imprevisti, contesto e correzioni).

## T2 — Mesi 4-6: fondamenta e vetrina web (12 settimane / 48 giornate)

| # | Task | gg |
|---|---|---|
| 1 | Monorepo pnpm, TypeScript, lint, CI di base | 2 |
| 2 | Progetto Supabase EU, Drizzle, prima migrazione | 2 |
| 3 | Schema `ranges` + tabelle correlate + indici PostGIS | 3 |
| 4 | Importazione del censimento dal foglio di T1 | 2 |
| 5 | `packages/schemas` — contratti Zod | 2 |
| 6 | API ricerca con raggio geografico e filtri | 3 |
| 7 | API scheda struttura | 2 |
| 8 | Next.js: struttura, layout, token di design | 3 |
| 9 | **Pagina scheda struttura SSG + rigenerazione** | 4 |
| 10 | Pagine provinciali e regionali | 2 |
| 11 | SEO: dati strutturati, sitemap, meta, Open Graph | 3 |
| 12 | Ricerca interattiva con mappa | 4 |
| 13 | Autenticazione Supabase, ruoli, RLS iniziale | 3 |
| 14 | Dashboard gestore: accesso e rivendicazione | 3 |
| 15 | Dashboard: scheda, orari, listino, servizi | 4 |
| 16 | Dashboard: chiusure e gare | 2 |
| 17 | Richieste di disponibilità + inoltro e-mail/WhatsApp | 3 |
| 18 | Guide e contenuti | 2 |
| 19 | Sentry, PostHog, metriche di BP §9.2 | 2 |
| 20 | Deploy produzione, dominio, verifica prestazioni | 3 |

**Uscita da T2:** ~40 strutture online e indicizzabili, gestori che aggiornano da soli, richieste che arrivano.

## T3 — Mesi 7-9: app nativa e prenotazione (18 settimane / 72 giornate)

| # | Task | gg |
|---|---|---|
| 21 | Expo: struttura, navigazione, token condivisi | 4 |
| 22 | `packages/api-client` tipizzato | 3 |
| 23 | Mobile: accesso OTP | 3 |
| 24 | Mobile: ricerca, mappa, filtri | 6 |
| 25 | Mobile: scheda struttura | 4 |
| 26 | **Prima sottomissione agli store (guscio)** | 3 |
| 27 | `core/booking`: disponibilità e sovrapposizioni | 4 |
| 28 | Schema prenotazioni + **vincolo di esclusione** | 3 |
| 29 | Regole di disponibilità e generazione slot | 5 |
| 30 | API prenotazioni | 4 |
| 31 | Mobile: flusso di prenotazione | 6 |
| 32 | Mobile: le mie prenotazioni | 3 |
| 33 | Dashboard: planner linee | 8 |
| 34 | Dashboard: inserimento prenotazione telefonica | 3 |
| 35 | Notifiche push Expo | 3 |
| 36 | E-mail transazionali | 2 |
| 37 | Test di integrazione su concorrenza prenotazioni | 3 |
| 38 | Prove sul campo con i primi 5 poligoni | 5 |

**Uscita da T3:** prenotazione reale attiva su 5 poligoni, app nelle mani degli utenti, tasso di conversione strumentato.

## T4 — Mesi 10-12: pagamenti, check-in, diario v1 (20 settimane / 80 giornate)

| # | Task | gg |
|---|---|---|
| 39 | Stripe: intenti di pagamento, webhook, idempotenza | 6 |
| 40 | Commissione, esposizione trasparente, rimborsi | 4 |
| 41 | Mobile: pagamento con Apple Pay / Google Pay | 4 |
| 42 | Generazione QR e check-in | 3 |
| 43 | Dashboard: schermata di check-in **con avviso non disattivabile** | 3 |
| 44 | Documenti: schema, scadenze, avvisi | 4 |
| 45 | Cifratura lato client dei documenti (facoltativa) | 5 |
| 46 | **`core/ammo` + test esaustivi** | 4 |
| 47 | Schema diario: sessioni, armi, movimenti munizioni | 3 |
| 48 | API diario | 4 |
| 49 | **Mobile: schermata munizioni e limiti di legge** | 5 |
| 50 | Mobile: armi (senza matricole) | 3 |
| 51 | Mobile: sessione manuale | 4 |
| 52 | **Auto-generazione sessione da check-in + conferma** | 4 |
| 53 | Costo per sessione e per colpo | 2 |
| 54 | Esportazione e cancellazione dati utente | 3 |
| 55 | Test RLS su tutte le tabelle del diario | 3 |
| 56 | Prestazioni, indici, ottimizzazione query | 4 |
| 57 | Revisione DPIA con il consulente | 2 |
| 58 | Rilascio pubblico e correzioni | 6 |

**Uscita da T4:** commissione attiva, diario in uso, contatore munizioni in produzione.

## T5 — Mesi 13-15: bersagli, GPG, integrazioni (14 settimane / 56 giornate)

| # | Task | gg |
|---|---|---|
| 59 | Caricamento foto bersaglio, ridimensionamento, **rimozione EXIF** | 4 |
| 60 | Marcatura fori: zoom, tocco, correzione | 6 |
| 61 | **`core/ballistics` + test** | 3 |
| 62 | Visualizzazione statistiche del gruppo | 4 |
| 63 | Andamento nel tempo per arma, calibro, distanza | 5 |
| 64 | **`core/gpg` + test** | 2 |
| 65 | Libretto GPG: schermate, avvisi, esportazione PDF | 6 |
| 66 | Manutenzione arma per numero di colpi | 3 |
| 67 | Esportazione CSV/iCal per i gestionali | 4 |
| 68 | Dashboard: insight di occupazione | 5 |
| 69 | SaaS Pro: piani, limiti, abbonamenti Stripe | 6 |
| 70 | Pass Pro: paywall e limiti del piano gratuito | 5 |
| 71 | Rilascio e correzioni | 3 |

## T6 — Mesi 16-18: consolidamento (8 settimane / 32 giornate)

| # | Task | gg |
|---|---|---|
| 72 | Debito tecnico e refactoring mirato | 6 |
| 73 | Prestazioni: cache, indici, tempi di risposta | 4 |
| 74 | Accessibilità e revisione dell'interfaccia | 4 |
| 75 | Onboarding gestore in autonomia (riduce le ore di §10 BP) | 6 |
| 76 | Strumentazione completa dei KPI di BP §9.2 | 4 |
| 77 | Documentazione tecnica e playbook di rilascio | 4 |
| 78 | Riserva | 4 |

## 12.1 Riepilogo e verifica del budget

| Trimestre | Settimane | Giornate |
|---|---|---|
| T2 | 12 | 48 |
| T3 | 18 | 72 |
| T4 | 20 | 80 |
| T5 | 14 | 56 |
| T6 | 8 | 32 |
| **Totale** | **72** | **288** |

**288 giornate sono 72 settimane-uomo: 8 in più del budget di 64 fissato in §1.2, pari a 18,5 ore a settimana contro le ~16 sostenibili.** Il piano, così com'è, non entra. Va detto adesso invece di scoprirlo al mese 14.

### Quanto si recupera tagliando ciò che è davvero opzionale

| Leva | Risparmio | Costo della rinuncia |
|---|---|---|
| Cifratura lato client dei documenti (task 45): si conservano solo le date di scadenza | 5 gg | **Nessuno**: BP §14.2 indica già le sole date come caso base |
| Insight di occupazione (task 68) ad Anno 2 | 5 gg | Basso: è retention B2B, utile solo dopo che i gestori hanno volume |
| Pass Pro (task 70) a inizio Anno 2 | 5 gg | Nessuno: BP §4.2 lo attiva comunque solo a 10.000 utenti registrati |
| Manutenzione arma per colpi (task 66) ad Anno 2 | 3 gg | Basso |
| Guide e contenuti (task 18) fuori dal tempo di sviluppo | 2 gg | Nessuno: è scrittura, rientra nel tempo di marketing |
| **Totale recuperabile senza toccare il consolidamento** | **20 gg** | |

**288 − 20 = 268 giornate = 67 settimane = 17,2 ore a settimana.** Ancora sopra il limite. Tagliare tutto l'opzionale non basta: **la scelta dell'app nativa dal lancio non entra nel calendario a 18 mesi.**

### Le tre opzioni reali

| | Opzione | Risultato | Cosa si perde |
|---|---|---|---|
| **A** | **Tornare alla PWA**, come raccomandato dal business plan | 256 gg = **64 settimane = 16,4 h/sett** | Notifiche push meno affidabili, nessuna presenza negli store. Nessuna perdita funzionale sostanziale |
| **B** | **Accettare 17,2 h/settimana** | Piano completo, nativo incluso | Si lavora il **7% sopra il limite dichiarato sostenibile**, senza alcun margine per imprevisti. Il primo trimestre difficile manda tutto in ritardo |
| **C** | **Estendere il calendario a 21 mesi** | 268 gg su 90 settimane = **14,9 h/sett** | Tre mesi di ritardo su tutte le milestone commerciali del business plan (§11.2), incluso il momento del round |

**Raccomandazione: opzione C se l'app nativa è una priorità, opzione A se lo è il calendario.** L'opzione B è quella che sembra funzionare e non funziona: un piano senza margine per un fondatore con turni ciclici non slitta in modo ordinato, si rompe sul task che capita di avere aperto nel mese peggiore.

Fra A e C la scelta è di merito, non tecnica, e va fatta guardando il business plan: le milestone di §11.2 sono legate ai trigger del round (§8.6) e alla finestra di attenzione aperta dalla riforma UITS (§1.6), che non aspetta tre mesi. **Questo spinge verso A.** Ma se la presenza negli store è considerata indispensabile per la credibilità verso i gestori — un argomento legittimo, in un settore in cui "c'è l'app" pesa più di quanto dovrebbe — allora C è la scelta onesta, e va messa a bilancio subito.

**In ogni caso il piano non ha margine.** Ogni funzionalità aggiunta dopo oggi va compensata togliendone un'altra. E se dopo T3 il tempo reale risulta inferiore a 14 ore settimanali, la decisione corretta non è comprimere il consolidamento di T6 — è tornare alla PWA, recuperando 32 giornate. Va presa **entro il mese 9**, prima che sia stato costruito troppo codice specificamente nativo.

---

# 13. RISCHI TECNICI

| # | Rischio | P | I | Mitigazione |
|---|---|---|---|---|
| 1 | **Rifiuto sugli store** | 3 | 4 | Sottomissione precoce del guscio in T3 (task 26); posizionamento sportivo; **web sempre disponibile come riserva** |
| 2 | **Qualità dei dati delle strutture** | 4 | 4 | `verified_at` in evidenza, KPI settimanale, segnalazione errori su ogni scheda. È il rischio 5 del BP tradotto in schema |
| 3 | **Errore nel calcolo dei limiti munizioni** | 2 | 5 | Test esaustivi, aggregazione per categoria, limiti in tabella e non nel codice, avvertenza sempre presente |
| 4 | Doppia prenotazione | 2 | 4 | Vincolo di esclusione a livello di database, non solo logica applicativa |
| 5 | **Perdita di dati per errore di RLS** | 2 | 5 | Test automatico in CI su ogni tabella; politiche esplicite; nessun accesso del gestore al diario |
| 6 | Costi di storage delle foto oltre le previsioni | 3 | 2 | Ridimensionamento sul dispositivo, limite nel piano gratuito, monitoraggio mensile |
| 7 | **Sviluppatore indisponibile** (turni, malattia) | 4 | 3 | Task da 1-3 giorni, rilasci frequenti, mai un ramo aperto per settimane |
| 8 | Dipendenza da Supabase | 2 | 3 | Sotto c'è Postgres standard; evitare funzioni proprietarie non essenziali |
| 9 | Modifica normativa sui limiti munizioni | 2 | 3 | Limiti in tabella dati: si aggiornano senza rilascio |
| 10 | Divergenza fra i due documenti | 3 | 2 | Regole di §0; revisione congiunta a ogni fine trimestre |

Il rischio 7 è quello che nella pratica si manifesta per primo, ed è la ragione per cui l'intera scomposizione di §12 è fatta di task brevi: un turno inatteso non deve lasciare il lavoro a metà.

---

# 14. DECISIONI RIMANDATE

> ⚠️ **Tre righe di questa tabella riviste dall'Aggiornamento 01/08/2026**: rilevamento automatico dei fori, Spotter, sincronizzazione offline del diario. Il verdetto per ciascuna è nell'Aggiornamento in fondo al documento — non tutte si sono mosse nella stessa direzione.

Elencate esplicitamente perché non vengano prese per inerzia, cioè scoprendo al momento sbagliato che qualcuno le aveva già decise scrivendo codice.

| Decisione | Quando | Criterio |
|---|---|---|
| **Rilevamento automatico dei fori** | Dopo 3 mesi dalla marcatura manuale | BP §3.5.7: solo se ≥25% degli utenti attivi carica >5 bersagli |
| Spotter | Anno 2 | Massa critica di utenti |
| Integrazione API con GESTIT | Dopo la prima trattativa | Serve la loro disponibilità, non il nostro codice |
| Abbandono del nativo per la PWA | **Entro il mese 9** | Se il tempo reale scende sotto 14 h/settimana |
| Estrazione del backend da Next.js | Mai, salvo evidenza contraria | Nessun problema di scala previsto prima dell'Anno 3 |
| App per tablet dei gestori | Anno 2 | La dashboard web risponde già su tablet |
| Sincronizzazione offline del diario | Anno 2 | Nei poligoni la copertura è spesso assente: da valutare sui reclami reali, non in anticipo |

L'ultima merita attenzione: molti poligoni indoor non hanno copertura cellulare, e il diario si compila proprio lì. Se emergesse come problema reale, la coda di scrittura offline diventerebbe prioritaria — ma va confermata dall'uso, non presunta.

---

*Documento tecnico v1.0 — 29 luglio 2026. Da rivedere alla fine di ogni trimestre, insieme al business plan.*

---

## Censimento funzionalità — confronto con mercato

> Censimento del 01/08/2026. Fonti: 4 analisi competitive indipendenti su app globali per il settore del tiro — `Analisi qwen.txt`, `analisi app tiro deepseek.txt`, `analisi perplexity.txt`, `analisi kimi.pdf` (cartella `app/apps/mobile/Analisi funzionalità APP/`). Frequenza = numero di fonti (su 4) che citano la feature nel proprio elenco ordinato per diffusione di mercato. Stato verificato contro il codice reale del repository al 01/08/2026, non contro la roadmap dichiarata. Nessuna priorità o fase è assegnata qui: è compito dell'utente deciderla a valle di questo censimento.
>
> Legenda stato: **Presente** = funzionante end-to-end nel flusso utente reale. **Parziale** = esiste una base di codice (schema dati, funzione pura, UI non collegata) ma manca integrazione o è raggiungibile solo in parte. **Assente** = nessuna traccia nel codice.

### Feature citate in tutte e 4 le fonti

| Feature | Frequenza | Stato nel codice | Note |
|---|---|---|---|
| Diario sessioni di tiro / logbook | 4/4 | Presente | `sessions` + `session_shots` su Supabase, gestito da `DiaryPage.jsx` end-to-end |
| Inventario armi / scheda arma | 4/4 | Presente | Storage solo-locale (`firearmsApi.js` → `localStore.js`), CRUD funzionante |
| Tracciamento munizioni | 4/4 | Presente | Storage locale (`ammoApi.js`), con valutazione limiti art. 97 TULPS in `domain.js` |
| Registrazione punteggi / scoring | 4/4 | Parziale | Colonna `target_holes.score` esiste nello schema DB; nessuna schermata permette di inserire un punteggio, né a livello di sessione né di bersaglio |
| Foto e allegati (armi, bersagli, documenti) | 4/4 | Assente | Colonna `storage_ref` presente nello schema (`user_documents`, `targets`) ma zero upload UI in tutto il repository |
| Manutenzione, pulizia e promemoria | 4/4 | Parziale | Tabella `maintenance_rules` esiste nello schema DB; nessuna API né UI la popola o la legge |
| Timer / shot timer per stage e allenamento | 4/4 | Presente | Cronografo (`CronografoPage.jsx`): segnale a ritardo configurabile, rilevamento colpo via microfono, split time. Funzione Pro, gate solo visivo |
| Calcolatore balistico (traiettoria, vento, deriva) | 4/4 | Assente | `packages/core/src/ballistics` esiste ma calcola solo statistiche di gruppo (centroide, MOA, correzione mira) su fori marcati manualmente — non è un calcolatore di traiettoria esterna. Nome ambiguo tra le fonti e il codice: verificato, non sono la stessa cosa |
| Directory e mappa poligoni | 4/4 | Presente | `SearchPage`, `RangeMap.jsx`, schede struttura SSG, censimento reale di ~80 poligoni |
| Training dry-fire / laser | 4/4 | Assente | — |
| Classifiche / leaderboard | 4/4 | Assente | — |
| Community, social feed, condivisione risultati | 4/4 | Assente | — |
| Gestione gare ed eventi | 4/4 | Assente | Nessuna tabella, API o UI per calendario gare, iscrizioni o risultati |
| Prenotazione linee di tiro | 4/4 | Parziale | Schema `bookings` con vincolo di esclusione anti-doppia-prenotazione pronto in DB; il flusso reale oggi (`BookingPage.jsx`) è solo una richiesta di disponibilità inoltrata al gestore via email, non uno slot prenotabile e confermabile all'istante |
| Marketplace / annunci armi usate | 4/4 | Assente | Esplicitamente escluso dai principi di prodotto ("nessuna intermediazione su armi o munizioni", `PRODUCT.md`) |
| Gamification (badge, sfide, duelli) | 4/4 | Presente | Medaglie (`MedagliePage.jsx`): 8 traguardi calcolati da sessioni/colpi/calibri |
| Integrazione hardware (cronografi, timer Bluetooth, sensori) | 4/4 | Assente | Il Cronografo usa solo il microfono del telefono; nessuna connessione a dispositivi esterni |
| Analisi colpi / shot grouping / auto-scoring da camera | 4/4 | Parziale | `computeGroupStats`/`computeSightCorrection` esistono e sono testati in `packages/core/ballistics` (duplicati anche in `domain.js` mobile), ma nessuna schermata permette di marcare fori su un bersaglio: funzione pura irraggiungibile da un flusso utente reale |
| E-commerce / checkout / carrello / POS | 4/4 | Parziale — **nome ambiguo** | Esiste un modulo di billing (`packages/core/billing.ts`, tabelle `subscription_plans`/`invoices`) ma è un abbonamento SaaS per i **gestori** (Pass Pro), non un carrello/checkout per l'utente finale come descritto dalle fonti. Verificare con l'utente se questa è la stessa feature o due cose diverse prima di trattarla come "coperta" |

### Feature citate in 3 fonti su 4

| Feature | Frequenza | Stato nel codice | Note |
|---|---|---|---|
| Export, condivisione e report (CSV/PDF/Excel) | 3/4 | Parziale | Export JSON dei dati locali (armeria/munizioni/documenti) implementato in `ProfilePage.jsx`; l'export CSV/iCal per il gestore (previsto dal Piano §7.3) non esiste — nessuna route `/api/v1/manage/export` |
| Documenti, licenze, permessi e scadenze | 3/4 | Presente | Storage locale (`documentsApi.js`), avvisi di scadenza a 90/30/7 giorni in `domain.js` |
| Sincronizzazione cloud multi-dispositivo | 3/4 | Parziale | I dati su Supabase (sessioni, prenotazioni) sono "cloud" per definizione quando l'utente è online; non esiste una sincronizzazione multi-dispositivo dichiarata o gestita esplicitamente (né conflitti, né merge) |
| Modalità offline | 3/4 | Assente | Nessun service worker, nessun manifest PWA, nessuna cache offline-first |

### Feature citate in 2 fonti su 4

| Feature | Frequenza | Stato nel codice | Note |
|---|---|---|---|
| Profilo utente e account tiratore (multi-profilo, preferenze) | 2/4 | Presente | Autenticazione Supabase (link magico), `ProfilePage.jsx`. Manca profilazione multi-disciplina/preferenze granulari descritta dalle fonti, ma il nucleo account/profilo è funzionante |
| Modalità giudice / Range Officer / match director tools | 2/4 | Assente | — |
| Integrazione con bersagli elettronici | 2/4 | Assente | — |
| Ricarica munizioni / reloading log | 2/4 | Assente | — |
| Noleggio armi / rental management | 2/4 | Parziale | `range_services.service` è un campo testo libero che può contenere "noleggio arma" come voce di listino; nessun flusso dedicato di prenotazione, cauzione o disponibilità noleggio |
| Controllo accessi con QR / check-in | 2/4 | Parziale | `bookings.qr_token` e `checked_in_at` esistono nello schema. Lato tiratore, `BookingsPage.jsx` mostra un pattern QR generato da un seed testuale — puramente cosmetico, non codifica dati scansionabili reali. Lato gestore: nessuno scanner, nessuna route `/api/v1/manage/checkin` |
| Integrazione con API di federazioni (UITS, FITDS, FITAV) | 2/4 | Assente | — |
| AI coaching / raccomandazioni automatiche | 2/4 | Assente | — |
| Multi-lingua | 2/4 | Assente | Nessun framework i18n; app solo in italiano |
| E-learning / corsi integrati | 2/4 | Assente | "Istruttore" compare solo come voce di prezzo in un listino di esempio, non come feature di gestione corsi |

### Feature citate in 1 fonte su 4

| Feature | Frequenza | Stato nel codice | Note |
|---|---|---|---|
| Ricerca, filtri e catalogo schede | 1/4 | Presente | `api/v1/ranges/search` con filtri, `/cerca` |
| Profili multi-tiratore / famiglia / team | 1/4 | Assente | — |
| Workflow legale per trasferimento armi | 1/4 | Assente | Esplicitamente fuori scope di prodotto |
| Companion app per wearable / smartwatch | 1/4 | Assente | — |
| Statistiche e analytics di progressione (grafici) | 1/4 | Assente | Componente `components/ui/chart.jsx` presente ma è scaffold shadcn mai importato da nessuna pagina |
| Tagging / categorizzazione sessioni | 1/4 | Assente | — |
| Cifratura zero-knowledge / end-to-end | 1/4 | Assente | Il Piano §8.2 la prevedeva come opzione per i documenti; ora i documenti sono solo-locali sul dispositivo (scelta di prodotto diversa, stesso obiettivo di privacy), ma la cifratura in sé non è implementata |
| Integrazione con sistemi governativi (invio telematico moduli) | 1/4 | Assente | — |
| Digital waivers (firme digitali di responsabilità) | 1/4 | Assente | — |
| Membership & billing automatizzato (abbonamenti ricorrenti) | 1/4 | Parziale — **nome ambiguo** | Esiste per i **gestori** (Pass Pro, `packages/core/billing.ts`), non per i tiratori. Stessa ambiguità della voce "E-commerce/POS" sopra |
| Waitlist management per linea di tiro | 1/4 | Assente | — |
| Multi-location (catene di poligoni) | 1/4 | Assente | Non applicabile al modello attuale: ogni poligono è un'entità indipendente |
| QR synchronization per gara / live results | 1/4 | Assente | — |
| VR simulation training | 1/4 | Assente | — |
| Scoring specifico trap / skeet / tiro a volo | 1/4 | Assente | — |
| Istruzioni audio per eventi ISSF | 1/4 | Assente | — |
| Arsenale con localizzazione fisica dell'arma | 1/4 | Assente | — |
| Pianificazione tattica / hit factor | 1/4 | Assente | — |
| Modalità multiplayer / competizione in tempo reale | 1/4 | Assente | — |
| Assicurazione, furto, smarrimento | 1/4 | Assente | — |

### Feature con nome ambiguo rispetto al codice

Due voci compaiono nelle analisi come feature consumer ma nel codice esiste solo l'equivalente lato B2B (gestori), non lato tiratori — segnalate invece di essere classificate a caso:

- **E-commerce / checkout / carrello / POS** (4/4): esiste billing SaaS per gestori (Pass Pro), non e-commerce per tiratori.
- **Membership & billing automatizzato** (1/4): stessa distinzione — abbonamenti esistono solo lato gestore.

---

## Aggiornamento del piano — 01/08/2026

> Questo aggiornamento nasce dal confronto fra il piano (v1.0, 29 luglio 2026) e lo stato reale del codice a 4 giorni di distanza. In quei 4 giorni (40 commit) è stato costruito quasi per intero T2, grosse parti di T3-T4 e un pezzo di T5 che il piano rinviava ad Anno 2. Il modello di stima a giornate/settimane-uomo, calibrato su ~15-16 ore/settimana di un solo sviluppatore, non descrive più la velocità osservata. Le decisioni qui sotto sono state discusse e confermate con l'utente il 01/08/2026; superano puntualmente le sezioni marcate nel corpo del documento.

### 1. Architettura: Supabase diretto + RLS, formalizzato come scelta definitiva

Il piano (§2.2) motivava REST versionata sotto `/api/v1` specificamente per evitare che l'app mobile si rompesse a ogni modifica del backend. Nella pratica, l'app mobile ha sempre parlato direttamente con Supabase per i dati personali (prenotazioni, sessioni, e ora anche armeria/munizioni/documenti, spostati sul dispositivo il 01/08/2026), bypassando `/api/v1`. `packages/api-client` non è mai stato costruito.

**Decisione: si formalizza questo come architettura definitiva, non come debito tecnico.** Row Level Security resta l'unico livello di protezione per i dati personali lato mobile. Il vantaggio di versionamento che l'API REST avrebbe dato si rinuncia consapevolmente: se in futuro servirà, si costruirà quando servirà davvero (un client nativo pubblicato sugli store, con versioni vecchie installate a lungo, è il caso che lo giustificherebbe — vedi punto 2).

Restano sotto `/api/v1` come oggi: ricerca/schede strutture (dati pubblici, cache, SEO) e billing gestori (dati sensibili lato B2B già passati da route handler reali).

### 2. Piattaforma mobile: nativo confermato, ma dopo altri due blocchi

**Decisione: Opzione C del piano (§12.1) — si mantiene l'obiettivo nativo (Expo/React Native), a calendario esteso rispetto alle stime originali.** Le 8 settimane lorde stimate dal business plan per il nativo erano calcolate sulla vecchia velocità; vanno ricalcolate quando si arriva a quel blocco, non ora.

**Sequenza decisa**: il setup tecnico nativo (Expo, eventuale `packages/api-client` se a quel punto servirà davvero — vedi punto 1) parte **dopo** i blocchi "Bersagli e punteggi" e "SEO/acquisizione", non subito. Fino ad allora l'app resta quella attuale (Vite/React, web).

Non è stata chiesta né decisa l'installabilità PWA (manifest, service worker): l'app resta una web app normale finché non viene deciso altrimenti.

### 3. Modello di pianificazione: backlog a blocchi, non più giornate

**Decisione: si abbandona il conteggio in giornate/settimane-uomo per il lavoro da qui in avanti.** §12 resta valido come elenco di task e dipendenze tra loro, non come stima di durata. Il piano procede per blocchi di lavoro ordinati per priorità; ogni blocco si considera chiuso quando è funzionante end-to-end, non quando si esaurisce un budget di giornate.

### 4. Backlog prioritario (ordine deciso il 01/08/2026)

| # | Blocco | Perché in questa posizione |
|---|---|---|
| 1 | **Bersagli e punteggi** (marcatura fori, scoring) | Le funzioni pure esistono già e sono testate (`packages/core/ballistics`, statistiche di gruppo, MOA, correzione mira) ma sono irraggiungibili: nessuna schermata permette di marcarle. È il completamento più a buon mercato di una promessa di prodotto già dichiarata ("Il Mio Tiro") |
| 2 | **SEO / acquisizione / contenuti** | Il prodotto ha già più del minimo T2 lato tiratore; il collo di bottiglia diventa farsi trovare — più poligoni censiti, più guide, più gestori che rivendicano la scheda |
| 3 | **Setup tecnico nativo** (Expo) | Come lavoro a sé stante, dopo i due blocchi sopra, non in parallelo |
| 4 | **Prenotazione reale + pagamenti + check-in QR reale** | Bloccato non solo tecnicamente ma da un prerequisito non tecnico — vedi punto 6. Resta il blocco più citato come critico nel censimento di mercato, ma non è il prossimo passo |

Questo ordine non è una sequenza rigida e cieca: se durante il blocco 1 o 2 emerge un motivo concreto per anticipare qualcos'altro, va rivalutato — ma il default è questo.

### 5. Vincoli reali aggiornati

| Vincolo del piano originale (§1.1) | Stato al 01/08/2026 |
|---|---|
| ~15-16 h/settimana | Non più tracciato: l'utente ha indicato che il tempo investito non è un vincolo da seguire in questa fase |
| Cassa Anno 1 ~10.400 € | **Zero € investiti finora.** Il progetto è bootstrap puro: ogni scelta tecnica deve restare a costo zero / piano gratuito finché non c'è revenue o funding — vincolo più stringente di quello scritto in §1.1, non meno |

### 6. Scadenze esterne (verificate con l'utente, non deducibili dal codice)

| Trigger (business plan) | Stato al 01/08/2026 |
|---|---|
| Round di investimento (BP §8.6) | **Non attivo.** Nessun round in corso: nessuna pressione di calendario da questo fronte |
| Finestra riforma UITS (BP §1.6) | **Da rivalutare il 1 settembre 2026.** Checkpoint esplicito da riprendere a quella data, non prima |
| Milestone commerciali legate agli store (BP §11.2) | **Confermate invariate.** Restano valide così come scritte, incluso con calendario nativo esteso (Opzione C) |

### 7. Nuovi prerequisiti non tecnici, tracciati esplicitamente

Due blocchi del piano sono ora esplicitamente subordinati a passi che non dipendono dal codice:

- **Pagamenti (Stripe)**: prima serve **apertura di una partita IVA** — non ancora avviata. Il blocco "prenotazione reale + pagamenti" (§4 sopra) non può iniziare la parte Stripe finché questo non è risolto, indipendentemente da quanto altro è pronto.
- **Revisione DPIA** (Piano, task 57; dati su munizioni/detenzione): il consulente **non è stato ancora contattato**. Da avviare per tempo, dato che una consulenza esterna ha tempi che non si comprimono con la velocità di sviluppo interna.
  - **Nota positiva**: lo spostamento di armeria/munizioni/documenti a storage solo-locale (01/08/2026, non più su Supabase) riduce il perimetro di questa DPIA per quei tre domini specifici — restano da valutare sessioni e prenotazioni, che rimangono su server.

### 8. Decisioni rimandate (§14) riviste

Delle sei decisioni rimandate elencate in §14, l'utente ha chiesto di rivalutarne tre. Verdetto per ciascuna:

**Rilevamento automatico dei fori — si ammorbidisce il gate temporale, si conferma quello di utilizzo.**
Il piano lo vincolava a "3 mesi dopo la marcatura manuale, solo se ≥25% degli utenti attivi carica >5 bersagli". Il gate temporale (3 mesi di calendario) non ha più senso alla velocità osservata — ma il gate di utilizzo sì: serve comunque un volume reale di bersagli marcati manualmente per costruire e validare il rilevamento automatico su dati veri, non su ipotesi. **Il criterio resta il 25% degli utenti attivi con >5 bersagli caricati, scorporato da qualunque numero di mesi.** Si valuta quando si arriva al blocco 1 e si osserva l'uso reale, non prima.

**Spotter — conferma del rinvio, con la ragione corretta.**
Verificato sul business plan (§13.3, §14.5, Allegato C): lo Spotter è un sistema di segnalazione/verifica dati con soglie di fiducia e anti-abuso, esplicitamente descritto come "strumento di qualità del dato, non di retention" che "produce segnalazioni false in proporzione diretta al valore del premio" se introdotto senza una community reale alle spalle. **Il suo blocco non è mai stato di tempo di sviluppo: è mancanza di utenti reali per costruire soglie di fiducia sensate.** Nessuna velocità di sviluppo lo sblocca prima — resta a T6/Anno 2 come da piano originale, per lo stesso motivo di sempre, non per uno nuovo.

**Sincronizzazione offline del diario — resta discrezionale, non promossa.**
Il piano la vincolava a "reclami reali" sulla copertura in poligono. Zero utenti reali esistono ancora (prodotto non lanciato), quindi il trigger non può essersi verificato per definizione — non perché il problema non esista, ma perché non c'è ancora nessuno che possa reclamarlo. Costruirla ora sarebbe una scommessa su un problema presunto, non osservato. **Resta rimandata**, ma vale la pena registrarla come opzione a basso costo aggiuntivo quando si lavora comunque sul blocco 1 (stessa area di codice, "Il Mio Tiro") — non una promozione a priorità, solo un'opportunità da cogliere se si presenta senza sforzo dedicato.

## Aggiornamento del piano — 03/08/2026

> Due giorni dopo l'Aggiornamento 01/08/2026, quattro cambi di stato verificati contro il codice reale — non contro intenzioni o backlog dichiarato.

### 1. Blocco 1 "Bersagli e punteggi" — già completato, non è più il prossimo passo

Verificato nel codice: `TargetsPage.jsx` (mobile) marca i fori su un bersaglio tap-to-mark, salva punteggio per foro (`target_holes.score`), calcola statistiche di gruppo (`computeGroupStats`) e persiste tutto su Supabase reale — nessun mock. Il blocco che l'Aggiornamento 01/08 metteva in cima al backlog per priorità (§4 di quell'aggiornamento) risulta quindi **chiuso**. Resta assente solo il rilevamento automatico dei fori da foto (§8 dello stesso aggiornamento, correttamente gated su un volume reale di bersagli marcati manualmente — ora possibile, perché lo strumento per generare quel volume esiste).

**Conseguenza pratica**: il blocco attivo del backlog per priorità è ora il **2 — SEO / acquisizione / contenuti**, non più l'1.

### 2. Dashboard gestore (§7.3) — da mock a dati reali

Le schermate elencate in §7.3 (scheda struttura, orari, chiusure/gare, richieste in arrivo — tutte fase T2) sono state ricollegate da dati fittizi a lettura/scrittura reale su `ranges`/`range_hours`/`range_closures`/`range_pricing`/`range_services`/`booking_requests`, con autorizzazione per-struttura via `range_managers` (non la whitelist email usata da `/admin`). Un account che gestisce più strutture (finora solo i due account admin, per verificare cosa vede un gestore reale) può cambiare struttura attiva da un selettore in testata.

### 3. Dashboard admin — non prevista dal piano originale, costruita per necessità operativa

Non è in nessuna sezione del Piano v1.0: è nata per evitare di editare `ranges` a mano via SQL su Supabase. Copre anagrafica struttura, orari, gestione utenti e permessi gestore (assegnazione/rimozione `range_managers`), con provincia/comune/regione selezionabili da elenco reale invece che campo libero. Gate a whitelist email (`ADMIN_EMAILS`), controllo ripetuto a inizio di ogni Server Action, non solo a livello di layout.

### 4. Due bug di piattaforma trovati e corretti, non specifici di una feature

- **Qualità dati geografici**: la Sardegna è tornata a sei province nel 2025 (LR 7/2021), "Sud Sardegna" abolita — il dataset comuni/province usato dai dropdown admin/gestore era fermo all'assetto 2016. Corretto e verificato comune per comune contro fonti ufficiali; corrette anche 3 strutture già censite con provincia obsoleta.
- **Aggiornamenti non in tempo reale**: creare una struttura da admin non rigenerava le pagine pubbliche statiche (mancava `revalidatePath`); anche dopo averlo aggiunto, il router cache lato client di Next.js (5 minuti di default) nascondeva comunque le modifiche a chi navigava cliccando link invece di ricaricare la pagina. Corretti entrambi.

### 5. Nuovo strumento di lavoro, non di prodotto

Adottato **graphify**: grafo di conoscenza del progetto (codice + documenti), rigenerato dopo modifiche strutturali importanti, usato per query su architettura e relazioni tra file invece di esplorazione manuale. Vive in `graphify-out/` (locale, non versionato). Non è un blocco della roadmap di prodotto — è tooling interno.
