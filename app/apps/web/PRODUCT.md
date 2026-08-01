# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Due pubblici distinti:

- **Tiratori sportivi**: cercano un poligono di tiro vicino a sé, confrontano orari/calibri/disciplina disponibili, e vogliono prenotare una linea senza dover telefonare. Utenti di `/cerca`, delle schede struttura, e (in futuro) del tracking delle proprie sessioni di tiro ("Il Mio Tiro").
- **Gestori di poligoni**: proprietari o staff di una struttura che vogliono rivendicare/pubblicare la propria scheda, tenerla aggiornata (orari, listino, chiusure), e ricevere richieste di prenotazione senza il doppio inserimento rispetto al proprio gestionale esistente (GESTIT, T.A.R.G.E.T., ecc.). Utenti della dashboard `/gestore/*` (oggi solo interfaccia, non ancora collegata ad autenticazione o backend reale).

## Product Purpose

Poligoni Italia è il layer di domanda B2C che oggi manca al settore del tiro sportivo in Italia: non un gestionale amministrativo, non un e-commerce di armi, non un social network. Il lato B2B (gestionali per singolo poligono) è già presidiato da anni da software verticali italiani; il lato scoperta/prenotazione nazionale per chi cerca un poligono non esiste. Successo = un tiratore trova e prenota una linea senza telefonare; un gestore riceve richieste senza inserimento doppio.

## Positioning

Non rivendica di essere il "primo operatore integrato" (claim verificato e rimosso dal business plan: esiste un ecosistema maturo di gestionali B2B — GESTIT, T.A.R.G.E.T., Esposito Software, ArMa Informatica — e alcune sezioni TSN offrono già prenotazione online autonoma). Il posizionamento verificabile e più solido: nessun operatore copre oggi il quadrante "verticale sul tiro + copertura nazionale" lato scoperta B2C. Strategia dichiarata: **integrare, non sostituire** i gestionali esistenti (es. export prenotazioni verso il gestionale del poligono), non competere con loro.

## Operating Context

- Ricerca strutture per posizione/regione/provincia, con filtro per tipo (TSN, privato, tiro a volo, dinamico).
- Scheda struttura: orari, indirizzo, contatti, linee di tiro, listino, servizi — quando disponibili; il censimento reale copre solo un sottoinsieme di questi campi per struttura (vedi Evidence on Hand).
- Dashboard gestore (rivendica struttura, orari, listino, chiusure, richieste) esiste come interfaccia ma senza autenticazione né collegamento al database reale: prossimo blocco di lavoro previsto, non ancora costruito.
- Nessuna prenotazione reale ancora attiva (schema dati booking esiste, con vincolo di non sovrapposizione a livello database, ma non è collegato a un flusso utente).
- Categoria di prodotto inquadrata deliberatamente come *sport utility*, non come prodotto legato a sicurezza/difesa personale (rilevante per store e percezione).

## Capabilities and Constraints

- Stack: Next.js App Router + Tailwind v4, monorepo pnpm (`packages/core`, `packages/db`, `packages/schemas`, `packages/ui`, `apps/web`).
- Dati: Postgres + PostGIS (Supabase in produzione), Drizzle ORM. Censimento reale di 80 strutture (non finte), con qualità dati eterogenea: indirizzo/telefono/sito arricchiti per la maggior parte, orari verificati solo per un sottoinsieme.
- Principio di onestà dei dati applicato in tutto il progetto: mai inventare orari, prezzi, recapiti o indirizzi non verificati — un campo mancante resta vuoto, non viene fabbricato. Questo vincolo guida anche le scelte di design (stati vuoti onesti, non placeholder che sembrano dati reali).
- Nessuna autenticazione utente implementata ancora, né lato tiratore né lato gestore.
- Deploy su Vercel, repo pubblico su GitHub.

## Brand Commitments

- Nome: **Poligoni Italia**.
- Identità visiva storica: verde di brand (`#1b5e20`), tipografia Inter.
- È in corso un esperimento locale (non committato) di restyle verso una palette blu/nero ispirata a BMW — **non ancora confermato come direzione finale**: da trattare come ipotesi da valutare (`/impeccable document` o `new-work`), non come vincolo di brand acquisito.

## Evidence on Hand

- Censimento reale di 80 poligoni italiani (61 TSN, 17 privati, 1 tiro a volo, 1 dinamico) in `packages/db/src/seed/census-2026-07.ts`, verificato struttura per struttura dopo la scoperta di un errore (un'azienda fornitrice erroneamente classificata come poligono, poi rimossa).
- `Business_Plan_Poligoni_Italia_v2.md` e `Piano_Sviluppo_App.md` alla radice del repository: fonti primarie per posizionamento, roadmap e vincoli tecnici.
- Nessun contenuto di marketing, testimonianza, caso studio o dato di traffico reale ancora raccolto: da non inventare in nessun lavoro di design.

## Product Principles

1. **Mai inventare dati reali**: nessun orario, prezzo, recapito o indirizzo fabbricato, nemmeno per rendere una scheda struttura "più completa" a vista.
2. **Integrare, non sostituire**: ogni funzionalità B2B (dashboard gestore) deve ridurre il lavoro doppio rispetto al gestionale esistente del poligono, non competere per rimpiazzarlo.
3. **Sport utility, non securitario**: il tono e le scelte di design devono restare coerenti con un prodotto sportivo/amatoriale, non con un'estetica tattica o da difesa personale.
4. **Due pubblici, due registri**: le superfici rivolte al tiratore (ricerca, scheda struttura) sono orientate alla scoperta rapida; quelle rivolte al gestore (dashboard) sono orientate al task e alla precisione operativa.

## Accessibility & Inclusion

Nessun requisito normativo specifico confermato al momento; si applicano le buone pratiche standard (contrasto, focus states, aria-label) già seguite nel codice esistente.
