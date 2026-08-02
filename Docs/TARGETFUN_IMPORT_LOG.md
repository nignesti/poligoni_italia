# Targetfun Import - Sessione 31 Luglio 2026

## Sommario Esecutivo

Importazione completata di **72 poligoni validati** nel database Supabase, estratti e verificati da Targetfun.it tramite scraping manuale + Google Places API.

| Metrica | Valore |
|---|---|
| **Candidati grezzi** | 405 (20 regioni) |
| **Dopo dedup vs DB** | 350 candidati netti |
| **Validati (CANDIDATO VALIDO)** | 72 ✅ |
| **Da verificare manualmente** | 274 |
| **Chiusi permanentemente** | 4 |
| **Database** | Supabase (online) |
| **Data source** | `targetfun_verified_batch` |

---

## Processo

### 1. Estrazione (405 righe)
- Scraping manuale da targetfun.it/blog/poligoni/ (20 regioni)
- Browser tabs × 4 parallelizzati con jQuery DataTable API
- Output: `targetfun-raw.json` (405 righe grezze: ABRUZZO, BASILICATA, CALABRIA, CAMPANIA, EMILIA-ROMAGNA, FRIULI-VENEZIA GIULIA, LAZIO, LIGURIA, LOMBARDIA, MARCHE, MOLISE, PIEMONTE, PUGLIA, SARDEGNA, SICILIA, TOSCANA, TRENTINO-ALTO ADIGE, UMBRIA, VALLE D'AOSTA, VENETO)

### 2. Deduplicazione (350 → 72)
- Script: `verify-targetfun.ts`
- Confronto nome+città vs DB locale (80 strutture esistenti)
- Scartati 55 duplicati probabili
- Prodotti 350 candidati netti

### 3. Verifica Google Places (2 batch)
- Batch 1: primi 200 candidati
- Batch 2: ultimi 150 candidati
- Query: `{nome} {città} {provincia} poligono tiro`
- Parametri: lingua=it, region=it
- Rate limit: 150ms tra chiamate (~10 req/s)

**Classificazione per candidato:**
- ✅ **CANDIDATO VALIDO** (72): trovato su Google, nome simile (≥0.5), OPERATIONAL, rating >4.0
- 🔍 **VERIFICA MANUALE** (274): match debole, nome diverso, chiuso temp., nessun match
- ❌ **SCARTA** (4): chiuso permanentemente su Google

### 4. Importazione nel DB (72 strutture)
- Script: `import-targetfun-verified.ts`
- Campi inseriti:
  - `name`, `type` (mappato da Targetfun tipo → range_type)
  - `comune`, `provincia`, `regione`, `cap`
  - `phone`, `email`, `website` (da Targetfun + Google Places)
  - `address` (da indirizzo_google, con fallback)
  - `location` (geography point, da coordinate provinciali approssimate)
  - `data_source` = 'targetfun_verified_batch'
  - `status` = 'censito'
- Modalità: `ON CONFLICT (slug) DO NOTHING` (no duplicati)

---

## Distribuzione Geografica (72 importati)

| Regione | Importati |
|---|---|
| EMILIA-ROMAGNA | 11 |
| SARDEGNA | 9 |
| PIEMONTE | 8 |
| TOSCANA | 6 |
| CAMPANIA | 6 |
| CALABRIA | 5 |
| LOMBARDIA | 5 |
| SICILIA | 5 |
| LAZIO | 4 |
| ABRUZZO | 3 |
| PUGLIA | 3 |
| VENETO | 3 |
| LIGURIA | 2 |
| MARCHE | 2 |
| **TOTALE** | **72** |

---

## File Creati

### Script
- **`app/packages/db/scripts/verify-targetfun.ts`**
  - Legge targetfun-raw.json
  - Dedup contro DB locale (nome+comune)
  - Google Places Text Search per ogni candidato netto
  - Classifica: CANDIDATO VALIDO / VERIFICA MANUALE / SCARTA
  - Output: CSV batch1 e batch2 (`scripts/out/`)
  - Uso: `DATABASE_URL=... pnpm exec tsx scripts/verify-targetfun.ts --batch=1|2`

- **`app/packages/db/scripts/import-targetfun-verified.ts`**
  - Legge CSV di verifica batch
  - Filtra CANDIDATO VALIDO
  - Trasforma in RangeInsert (slug, type, location, etc.)
  - Importa con ST_GeogFromText(POINT)
  - DRY-RUN di default, `--commit` per eseguire
  - Uso: `DATABASE_URL=... pnpm exec tsx scripts/import-targetfun-verified.ts [--commit]`

### Dati
- **`app/packages/db/scripts/targetfun-raw.json`**
  - 405 righe grezze da Targetfun.it
  - Campi: regione, tipo, nome, citta, provincia, cap, indirizzo, telefono, sito, email, note
  - Fonte: scraping manuale via browser tabs, DataTable API

### Configurazione
- **`.gitignore`** aggiunto: `app/packages/db/scripts/out/` (esclude CSV temporanei)

---

## Dipendenze Aggiunte

- `csv-parse@7.0.1` — parser CSV
- `uuid@14.0.1` — generazione UUID

---

## CSV Output (Temporanei, non committati)

- **`scripts/out/targetfun-verify-batch1.csv`** (200 righe)
  - Colonne: regione, tipo, nome_targetfun, citta, provincia, telefono, sito_targetfun, email, trovato_su_google, nome_google, indirizzo_google, stato_attivita, rating, recensioni, azione_consigliata, confidenza

- **`scripts/out/targetfun-verify-batch2.csv`** (150 righe)
  - Stesso schema batch1

**Uso**: rivedere a mano le righe con azione_consigliata="VERIFICA MANUALE" per decidere se aggiungere ulteriori candidati nel DB

---

## Sicurezza

### Google Maps API Key
- ⚠️ **Key compromessa**: esposta in transcript durante import
- ✅ **Azione**: rigenerare key nel Google Cloud Console
- ✅ **Best practice**: usare `export GOOGLE_MAPS_API_KEY=...` in terminale privato (non in chat)

### Credential Handling
- `verify-targetfun.ts` e `import-targetfun-verified.ts` usano solo `process.env.DATABASE_URL` e `process.env.GOOGLE_MAPS_API_KEY`
- No hardcoded secrets
- Idonei per CI/CD

---

## Prossimi Step

### Immediati
1. **Rigenerare Google Maps API key** (in Google Cloud Console)
   - La key attuale è compromessa (esposta in transcript)

2. **Verificare 274 candidati manuali**
   - Leggere CSV batch1 e batch2 con azione_consigliata="VERIFICA MANUALE"
   - Decidere se aggiungere al DB (basarsi su indirizzo_google, rating, nome_google, link Maps)
   - Stimato: 100-150 candidati aggiuntivi importabili

### Breve termine (Roadmap)
1. **Geocoding batch**: coordinate precise per 72 importati
   - Attualmente usano centro provinciale (approssimato)
   - Query Google Places Place Details per lat/lng esatto

2. **Verifica attività**: controllare location+phone vs Google Maps (confidence score)
   - Rating > 4.0
   - OPERATIONAL status
   - Evitare strutture chiuse o inattive

3. **Esport candidati "da verificare"**: creare lista per revisione manuale
   - Priorizzare per provincia alta densità
   - Segmentare per tipo (TSN vs FIDTS vs privato)

### Medio termine
1. **Integrazione sito web**: ricavare orari, prezzi, discipline da website candidati
2. **Notifica gestori**: contattare nuove strutture per rivendicazione
3. **Aggiornamento batch**: ripetere verifica Targetfun ogni trimestre

---

## Note Metodologiche

### Fonti
- **Targetfun.it**: 405 righe, scraping manuale 20 regioni (attendibilità: media, dati eterogenei per proprietario)
- **Google Places API**: autorità verificatrice (nome, indirizzo, stato, rating)
- **DB locale**: 80 strutture già censite, base per dedup

### Limitazioni
- **Location approximated**: coordinate del capoluogo provincia, non indirizzo esatto
  - Consigliato: geocoding batch con Place Details API
- **274 candidati manuali**: match Google debole o nessuno match
  - Possono essere veri (dati vecchi su Targetfun) o falsi positivi
  - Richiedono revisione umana
- **API rate limit**: 150ms tra chiamate per evitare quota overage

### Tradeoff
- **Velocità vs precision**: usate coordinate province per importazione veloce, geocoding dopo
- **Automazione vs manuale**: 72 auto (alta confidenza), 274 manual (revisione umana)

---

## Commit Reference

```
f536f03 Aggiungi verifica Targetfun e importazione 72 poligoni validati
```

**Repository**: https://github.com/nignesti/poligoni_italia.git (main branch)

---

## Contatti / Domande

- Per rieseguire verifica: vedi comandi in sezione "Script"
- Per aggiungere candidati manuali: leggere CSV, aggiungere righe a `targetfun-raw.json`, rieseguire import
- Per geocoding batch: creare script con Place Details API (coordinate esatte)
