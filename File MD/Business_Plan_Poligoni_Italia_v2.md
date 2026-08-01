# BUSINESS PLAN — POLIGONI ITALIA
## Versione 2.1 — Aggiornata e Integrata — 29-31 luglio 2026

> **Documento di lavoro riservato.** Sostituisce integralmente l'*Executive Business Plan* v1.0 (4 pagine). Integra tre revisioni indipendenti e un ciclo di verifica delle fonti condotto il 29 luglio 2026, più una ricerca di mercato dedicata su piattaforme digitali per poligoni in Italia ed Europa (`RICERCA_MERCATO.md`, 31 luglio 2026), integrata con lo stesso criterio di verifica indipendente — non recepita acriticamente. Il contributo principale della ricerca è **ML Armory** (§3.5.3-bis), il concorrente italiano più vicino al modulo "Il Mio Tiro" finora non censito.
>
> **Documento complementare**: `Piano_Sviluppo_App.md` contiene il piano tecnico esecutivo (architettura, modello dati, API, scomposizione in task). Questo business plan resta la fonte unica per *cosa* si costruisce e *in che ordine*; quel documento possiede solo il *come*. Le due eccezioni da conoscere: il piano tecnico adotta l'**app nativa dal lancio** invece della PWA-first raccomandata in §12.2, e ne quantifica la conseguenza sul calendario; e sposta lo **Spotter** ad Anno 2, coerentemente con quanto già osservato in §13.3.

---

## INDICE

| § | Sezione |
|---|---|
| 1 | Executive Summary |
| 2 | Analisi del Mercato e del Problema |
| 3 | Soluzione e Proposta di Valore — *incl. §3.5 Modulo "Il Mio Tiro"* |
| 4 | Modello di Monetizzazione |
| 5 | Strategia Go-to-Market |
| 6 | Piano di Marketing e Comunicazione |
| 7 | Piano di Partnership |
| 8 | Piano Finanziario |
| 9 | Metriche e KPI |
| 10 | Team e Competenze |
| 11 | Roadmap Operativa a 18 Mesi |
| 12 | Analisi SWOT e Matrice dei Rischi |
| 13 | Strategia di Retention |
| 14 | Compliance Normativa e Sicurezza Dati |
| 15 | Domande Aperte e Prossimi Passi |
| — | Nota Metodologica |
| — | Assunzioni Critiche da Verificare |
| — | Checklist per Due Diligence |
| — | Allegati (Fonti, Benchmark, Costi) |

---

# SEZIONE 1: EXECUTIVE SUMMARY

## 1.1 Che cosa fa Poligoni Italia

Poligoni Italia mette online, in tempo reale, la disponibilità delle linee di tiro sportivo, difensivo e ricreativo in Italia — oggi prenotabili quasi esclusivamente per telefono, e-mail o passaparola — e fornisce ai gestori uno strumento di gestione slot e check-in digitale che si affianca ai loro sistemi amministrativi esistenti.

Non è un gestionale amministrativo, non è un e-commerce di armi, non è un social network. È il **layer di domanda** che oggi manca a un settore in cui il lato dell'offerta è già parzialmente informatizzato ma resta invisibile e non prenotabile dall'esterno.

## 1.2 Il problema in una riga

Un tiratore che vuole sparare sabato mattina non ha alcun modo di sapere, senza telefonare, quale poligono nel raggio di 50 km sia aperto, abbia una linea libera al calibro giusto e a che prezzo. Un gestore che ha linee vuote alle 15:00 di martedì non ha alcun modo di riempirle.

## 1.3 Il mercato, con i numeri verificati

| Indicatore | Valore | Fonte |
|---|---|---|
| Porti d'arma uso caccia (2025) | **634.471** (+46.428 sul 2024, +7,9%) | Polizia di Stato via Armi e Tiro |
| Porti d'arma uso tiro a volo (2025) | **588.145** (+34.753 sul 2024, +6,3%) | Idem |
| Totale porti d'arma in corso di validità (2025) | **1.275.930** | Idem |
| Tesserati alle federazioni del tiro | **oltre 100.000** | La Verità, luglio 2026 |
| Sezioni TSN sul territorio | **~300** (altra fonte: 279) | UITS / Wikipedia |
| Poligoni privati censiti | **~70**, elenco in crescita | Mappa Armi e Tiro |
| Contributi pubblici 2026 al comparto tiro | **oltre 13 M€** su 344,4 M€ totali | Sport e Salute |

Il mercato **cresce strutturalmente**: la crescita delle licenze caccia e tiro a volo è superiore non solo al 2024 ma all'intero triennio precedente. Non è un rimbalzo post-Covid.

## 1.4 Dimensionamento TAM / SAM / SOM

Nessuna fonte pubblica misura il giro d'affari degli accessi ai poligoni italiani. La stima seguente è **costruita, non citata**, e la formula è esposta perché possa essere contestata.

**TAM — spesa annua in accessi al poligono in Italia**

```
Praticanti attivi stimati              ~250.000
  (>100.000 tesserati federali + praticanti non tesserati
   con porto d'arma che frequentano poligoni)
× Frequenza media                        8 sessioni/anno
× Scontrino medio a sessione                    30 €
   (linea + bersagli + eventuale noleggio/munizioni)
= TAM in GMV                             ~60 M€/anno
= TAM in ricavi piattaforma            ~4,0–4,5 M€/anno
   (take rate ~6% + SaaS B2B)
```

**SAM — quota realisticamente indirizzabile**

Strutture con turni a slot e gestione prenotabile: ~250 delle ~370 censite (si escludono i campi solo-gara, quelli senza linee prenotabili e quelli con agibilità sospesa). Praticanti raggiungibili digitalmente: ~150.000.
→ **SAM ≈ 36 M€ GMV / ≈ 2,5 M€ ricavi**

**SOM — obiettivo Anno 3**

150 poligoni attivi, 2,75 M€ di GMV intermediato, ~293 k€ di ricavi ≈ **12% del SAM in ricavi**. Le assunzioni che portano a questo numero sono esposte in §8 e §9 e sono verificabili una a una.

## 1.5 Posizionamento — e una correzione al documento originale

Il business plan v1.0 rivendicava lo status di **"primo operatore integrato (first-mover)"**. **Questa affermazione va rimossa, non ammorbidita.** La verifica ha individuato un ecosistema italiano maturo di software verticali per poligoni — GESTIT, T.A.R.G.E.T., Esposito Software, ArMa Informatica, New Time — e diverse sezioni TSN che offrono **già oggi** prenotazione online autonoma (Catania, Thiene, Este, Mirano). Il lato B2B è presidiato da anni.

Il claim difendibile, e sufficiente, è un altro:

> **Non esiste in Italia un layer di discovery e prenotazione nazionale, trasversale a tutti i poligoni.** L'offerta è informatizzata ma frammentata in centinaia di isole non interoperabili: ogni poligono ha il suo gestionale, il suo sito, il suo modulo di prenotazione. Nessuno ha il tiratore.

Questa è una posizione più modesta e molto più solida. Un investitore che verifica il claim "first-mover" in dieci minuti di ricerca e lo trova falso mette in discussione ogni altro numero del documento.

## 1.6 Il fattore di tempismo: la riforma UITS

Il **26 giugno 2026** è stato pubblicato il decreto-legge n. 108/2026, il cui articolo 8 riordina l'Unione Italiana Tiro a Segno. È il fatto più rilevante accaduto al settore negli ultimi vent'anni e ricade esattamente nella finestra di questo piano. Effetti sintetici:

- Separazione tra componente istituzionale (ente pubblico) e componente sportiva ("Istituzione sportiva" con bilancio autonomo);
- **Gestione degli impianti centralizzata presso UITS**, con facoltà di delega a terzi tramite procedure pubbliche;
- I beni del demanio militare passano in comodato direttamente a UITS;
- Istituzione dell'Ispettore UITS retribuito e di un comitato tecnico di vigilanza su infrastrutture e agibilità;
- **I poligoni privati possono federarsi a UITS** per attività addestrative e sportive;
- Il DIMA (certificato di maneggio armi) resta rilasciabile solo dalle sezioni TSN;
- 90 giorni per l'adeguamento dello statuto (scadenza indicativa: fine settembre 2026), più 30 per il regolamento di contabilità.

La riforma è **fortemente contestata**: presidenti di sezione ne chiedono la soppressione parlando di "esproprio delle TSN".

**Perché conta per questo progetto.** La centralizzazione trasforma un mercato di ~300 controparti autonome in un mercato con **un interlocutore nazionale unico**. È simultaneamente la più grande opportunità (un solo accordo può sbloccare centinaia di strutture) e il più grande rischio (un solo soggetto può chiudere il mercato). È inoltre una finestra di attenzione: nei prossimi 12 mesi le sezioni saranno costrette a rivedere processi e contabilità, e la disponibilità al cambiamento sarà più alta della norma. Il piano è costruito per sfruttare questa finestra.

## 1.7 Obiettivi a 3 anni

| | Anno 1 | Anno 2 | Anno 3 |
|---|---|---|---|
| Poligoni attivi | 15 | 60 | 150 |
| Utenti registrati | 1.500 | 12.000 | 40.000 |
| Prenotazioni | 4.000 | 30.000 | 110.000 |
| GMV intermediato | ~100 k€ | ~750 k€ | ~2,75 M€ |
| Ricavi | ~2,8 k€ | ~73,5 k€ | ~293 k€ |
| Costi (cash-out) | ~10,4 k€ | ~56,5 k€ | ~192,5 k€ |

Break-even di cassa atteso **intorno al mese 19**; break-even con fondatore retribuito a valori di mercato **intorno al mese 31**. La distinzione è mantenuta esplicita in tutto il documento (§8).

## 1.8 La richiesta

Nessuna richiesta di capitale nei primi 12 mesi. Il piano è progettato per essere **autofinanziato con meno di 12.000 € di cassa** nel primo anno. Un eventuale round pre-seed da 150-250 k€ ha senso solo **dopo** il superamento dei trigger di trazione definiti in §8.6 — non prima, perché prima non ci sarebbe nulla da accelerare se non il rischio.

---

# SEZIONE 2: ANALISI DEL MERCATO E DEL PROBLEMA

## 2.1 Dimensione e struttura del mercato

### 2.1.1 La domanda: chi impugna un'arma in Italia

I porti d'arma in corso di validità nel 2025 sono **1.275.930**, così ripartiti:

| Categoria | 2024 | 2025 | Variazione |
|---|---|---|---|
| Uso caccia | 588.043 | **634.471** | +46.428 (+7,9%) |
| Uso tiro a volo | 553.392 | **588.145** | +34.753 (+6,3%) |
| Difesa personale | 9.891 | **8.967** | −924 (−9,3%) |
| Guardie giurate | 42.389 | **44.347** | +1.958 (+4,6%) |

*Fonte: Polizia di Stato, elaborazione Armi e Tiro (2026).*

Due letture non ovvie che il documento originale non faceva:

1. **Il porto d'arma non è il mercato.** Un porto d'arma per uso caccia non implica la frequentazione di un poligono: molti cacciatori sparano solo in battuta. Il porto per uso tiro a volo (588.145) è un proxy migliore, ma include chi frequenta i campi di tiro a volo, che sono un'altra categoria di impianto rispetto ai poligoni a segno. **Usare 1,22 milioni come "mercato indirizzabile" è scorretto** ed è un errore presente in due delle tre revisioni ricevute.
2. **La categoria in calo è quella della difesa personale** (−9,3%): la crescita del settore è sportiva e venatoria, non securitaria. È un dato di posizionamento, non solo di mercato: rafforza l'inquadramento dell'app come *sport utility* e allontana connotazioni problematiche per gli store e per gli investitori.

**Base di calcolo adottata in questo piano**: praticanti attivi che frequentano poligoni ≈ **250.000**, ottenuti sommando gli oltre 100.000 tesserati federali a una stima di praticanti non tesserati con licenza valida. La Verità (luglio 2026) parla di una "platea informale di appassionati" nell'ordine di "diverse centinaia di migliaia". Il numero resta una **stima dichiarata**, non un dato.

### 2.1.2 L'offerta: quanti sono davvero i poligoni

Il documento originale indica "~440 poligoni mappati" senza fonte. La verifica non ha trovato alcuna fonte pubblica che confermi quel numero preciso. Ricostruzione dal basso:

| Componente | Numero | Fonte |
|---|---|---|
| Sezioni TSN (Tiro a Segno Nazionale) | ~300 (altra fonte: 279) | UITS / Wikipedia |
| Poligoni privati censiti | ~70, "elenco destinato ad aumentare" | Mappa Armi e Tiro |
| Campi FITAV / tiro a volo, campi FITDS, campi long range | non censiti in modo aggregato | — |
| **Totale verificabile** | **~370** | |
| **Stima totale prudenziale** | **370–450** | elaborazione propria |

**Raccomandazione operativa: non scrivere "440 poligoni" in nessun documento destinato all'esterno.** Scrivere: *"circa 300 sezioni TSN e almeno 70 poligoni privati censiti, per una stima complessiva di 370-450 strutture"*, citando le due fonti. Se in seguito il censimento proprio della piattaforma produrrà un numero migliore, quello diventerà un asset informativo proprietario — e sarà un dato che nessun concorrente possiede.

### 2.1.3 I flussi economici pubblici

Sport e Salute ha assegnato per il 2026 **344,4 milioni di euro** agli organismi sportivi. Al comparto tiro (esclusa la disciplina arco) vanno **oltre 13 milioni**:

| Federazione | Contributo 2026 |
|---|---|
| FITAV (Tiro a Volo) | 7.198.719 € |
| UITS (Tiro a Segno) | 4.074.882 € |
| FIDASC (Discipline con Armi Sportive da Caccia) | 1.557.757 € |
| FITDS (Tiro Dinamico Sportivo) | incremento massimo consentito (+15%) |

*Fonte: Sport e Salute, riparto contributi 2026.*

**Attenzione all'uso di questo dato.** Sono contributi alle federazioni, non un fondo accessibile alla piattaforma né una misura della spesa dei tiratori. Nel business plan servono a dimostrare una cosa sola, ma importante: **il settore è in tenuta o crescita nel giudizio del regolatore pubblico**, che alloca risorse con un modello algoritmico basato su risultati e crescita. Presentarli come "mercato" sarebbe fuorviante e verrebbe smontato in due minuti.

## 2.2 Trend di settore

| Trend | Evidenza | Implicazione per il progetto |
|---|---|---|
| **Crescita strutturale delle licenze** | +7,9% caccia, +6,3% tiro a volo nel 2025, sopra l'intero triennio precedente | Il bacino di utenza si allarga da solo: la crescita non dipende dall'evangelizzazione del mercato |
| **Riforma UITS (DL 108/2026)** | Pubblicata in Gazzetta il 26 giugno 2026; 90 giorni per lo statuto | Finestra di attenzione e riorganizzazione; interlocutore nazionale unico; incertezza operativa nelle sezioni |
| **Apertura ai poligoni privati** | Il DL consente ai campi privati di federarsi a UITS | Il segmento privato, oggi il più digitalizzabile, entra nel perimetro federale: cresce la rilevanza di un layer trasversale pubblico/privato |
| **Digitalizzazione già avviata ma frammentata** | Booking online autonomo attivo su TSN Catania, Thiene, Este, Mirano | La domanda di prenotazione online è già dimostrata dal comportamento dei gestori. Non va creata: va aggregata |
| **Spostamento da difesa a sport** | Licenze difesa personale −9,3% | Posizionamento sportivo coerente con la direzione del mercato e con le policy degli store |
| **Contrazione del volontariato dirigenziale** | Presidenti di sezione volontari, Ispettori UITS retribuiti (DL 108) | Le sezioni hanno poco tempo dirigenziale: uno strumento che *toglie* lavoro ha più chance di uno che ne aggiunge |

## 2.3 Analisi della domanda: profili di tiratore

| Profilo | Stima quota | Frequenza | Bisogno primario | Valore per la piattaforma |
|---|---|---|---|---|
| **Neofita / curioso** | 15% | 1-2 volte, poi decide | Sapere *dove andare* e *cosa serve*: capisce poco di calibri, discipline, documenti | **Il più alto.** Non ha un poligono di riferimento né un numero da chiamare: è l'unico segmento per cui la piattaforma non ha alternativa |
| **Occasionale** | 30% | 2-5 volte l'anno | Trovare disponibilità in una finestra ristretta, spesso weekend | Alto: non ha rapporto fiduciario col gestore, la telefonata gli costa |
| **Abituale non agonista** | 30% | 1-3 volte al mese | Comodità, storico, gestione scadenze documentali | Medio: ha già il suo poligono. Si conquista con log-book e scadenze, non con la ricerca |
| **Agonista tesserato** | 15% | settimanale | Linee tecniche specifiche, orari di allenamento, gare | Basso in prenotazione (ha canali diretti), **alto in credibilità**: è l'opinion leader della community locale |
| **Cacciatore in pre-stagione** | 10% | stagionale, picchi | Taratura arma, verifica ottiche prima dell'apertura | Alto ma stagionale: picchi di domanda ad agosto-settembre |
| **Frequentatore obbligato** (guardie giurate, obbligo DIMA) | trasversale | per obbligo normativo | Assolvere un adempimento nel minor tempo possibile | Molto alto: domanda anelastica e ricorrente, guidata da scadenze legali |

**Implicazione strategica non presente in nessuna revisione.** I segmenti con il maggior valore per la piattaforma — neofita, occasionale, frequentatore obbligato — sono esattamente quelli **meno serviti** dal sistema attuale, perché non hanno relazione con un gestore. I segmenti che il gestore già serve bene (abituale, agonista) sono quelli su cui la piattaforma porta meno valore incrementale. Questo deve guidare l'intera comunicazione B2C: **non parlare a chi spara già ogni settimana.**

Il segmento "frequentatore obbligato" merita attenzione particolare: il DL 108/2026 conferma che il DIMA è rilasciabile solo dalle sezioni TSN, il che rende quella domanda strutturale, prevedibile e non contendibile da altri canali.

## 2.4 Analisi dell'offerta: profili di poligono

| Profilo | Stima | Grado di digitalizzazione | Atteggiamento previsto |
|---|---|---|---|
| **Sezione TSN grande** (>1.000 tesserati, città capoluogo) | ~50 | Medio-alto: gestionale amministrativo, spesso booking online proprio | **Difficile**: ha già una soluzione, il cambio ha costo. Va approcciata come canale di domanda incrementale, mai come sostituzione |
| **Sezione TSN media** (200-1.000 tesserati) | ~150 | Basso-medio: gestionale amministrativo, prenotazione telefonica | **Il target primario.** Ha il problema, non ha la soluzione, non ha budget per svilupparla |
| **Sezione TSN piccola** (<200 tesserati, spesso volontaria) | ~100 | Molto basso: quaderno, telefono | Alta resistenza, basso volume. Bassa priorità nonostante l'apparente bisogno |
| **Poligono privato / ASD** | ~70+ | Variabile, spesso alto: orientato al cliente, sito e social attivi | **Il miglior early adopter.** Ha logica commerciale, cerca clienti, decide in fretta senza organi collegiali |
| **Campo tiro a volo / dinamico / long range** | non censito | Variabile | Fase 2: esigenze di prenotazione diverse (pedane, stage) |

**Conclusione operativa.** I primi 15 poligoni vanno cercati tra i **privati/ASD** e le **sezioni TSN medie**, non tra le grandi sezioni cittadine — controintuitivo rispetto all'istinto di puntare ai nomi più noti, ma i grandi hanno già risolto il problema e hanno cicli decisionali collegiali lunghi.

## 2.5 Analisi competitiva

### 2.5.1 La mappa reale dei concorrenti

Nessuna delle tre revisioni ricevute ha individuato i concorrenti effettivi. Due indicavano Anolla, Ticketinghub e PrenotaUnCampo — tutti software sportivi generici. La verifica ha invece trovato un ecosistema verticale italiano consolidato.

| Concorrente | Tipo | Cosa fa | Minaccia |
|---|---|---|---|
| **GESTIT** (gestionetsn.it) | Gestionale verticale TSN | Tesseramento, sportello segreteria, armeria, **Registro Frequenze al tiro, Registro Munizioni, prove di maneggio**, registro armi | **Alta come incumbent, bassa come concorrente diretto.** Presidia la contabilità obbligatoria, non la domanda. Ma è già installato dai gestori e ha la relazione |
| **T.A.R.G.E.T.** (Old Fox Software) | Gestionale verticale | Gestione poligoni | Media |
| **Esposito Software** | Gestionale verticale | Archivio tiratori, schedario armi, registrazione ingressi/uscite | Media |
| **ArMa Informatica** | Sviluppo su commessa | Gestionale prenotazioni per singole sezioni (es. TSN Mirano) | Media: dimostra che le sezioni pagano per il booking |
| **Booking proprietari** (TSN Catania, Thiene, Este, Mirano) | Soluzioni singole | Prenotazione turni per la propria struttura | **Alta a livello locale**: dove esistono, il valore incrementale della piattaforma è solo la discovery |
| **Anolla** | SaaS sportivo orizzontale | Prenotazione impianti, pricing a consumo, piano free. **Nella pagina impianti sportivi non menziona i poligoni** | **Bassa oggi**, media come fast follower: ha l'infrastruttura ma non il verticale né la conoscenza normativa |
| **Telefono / WhatsApp / passaparola** | — | — | **Il concorrente principale.** Gratuito, universale, funziona. Ogni analisi che lo ignora è incompleta |
| **MyGuns** (Svizzera) | App diario/inventario | Sessioni, colpi, scorte munizioni, inventario armi cifrato zero-knowledge, dati balistici | **Media-alta sul solo modulo diario** (§3.5.2). Non prenota, non conosce l'ordinamento italiano |
| **ML Armory** (Italia) | App diario/inventario/ricarica | Inventario armi-munizioni-ricariche, cassaforte con conteggio preciso, **ricette di ricarica con scalaggio automatico dei componenti**, registro sessioni (data, colpi, munizioni, meteo, bersagli), cronografia, obiettivi/traguardi. Nessun account, dati locali + iCloud | **La più alta sul modulo diario** (§3.5.3-bis). È italiana, in italiano, lanciata nel 2025: più vicina di MyGuns per lingua e mercato. Non prenota, non ha relazione con i poligoni, solo iOS |
| **TargetScan, Shotlog, ShotScore, MantisX** | App di scoring e analisi | Scoring da foto, statistiche, analisi del movimento con sensore | Media sul modulo diario, **nulla** sul marketplace: nessuna ha rapporti con le strutture |

### 2.5.2 Le due implicazioni che riscrivono la strategia

**Prima: il modulo B2B previsto dalla v1.0 non è competitivo come gestionale.**
GESTIT esiste perché tiene il **Registro delle Frequenze al tiro** e il **Registro Munizioni** — adempimenti di legge. Un gestore non sostituisce lo strumento che gli tiene i registri con uno che gestisce le prenotazioni. Il "Poligoni Manager" descritto nella v1.0 (planner linee + check-in QR + notifiche push) è utile, ma **non sostituisce nulla**: si aggiunge. Presentarlo come gestionale significa perdere il confronto su un terreno in cui non si può vincere e non serve vincere.

**Seconda: la strategia corretta è integrare, non sostituire.**

> Poligoni Italia porta **clienti e prenotazioni**. GESTIT e simili tengono **registri e contabilità**. Non si sovrappongono. La proposta al gestore non è "cambia sistema", è "aggiungi un canale che non ti costa nulla finché non ti porta qualcuno".

Questo riformula il rischio n. 1 dell'intero progetto. La resistenza digitale dei gestori è alta soprattutto verso i cambi di sistema; è molto più bassa verso un canale aggiuntivo a costo zero. Ne discendono direttamente il modello di pricing (§4), il go-to-market (§5) e la roadmap tecnica (§11, dove l'export/integrazione verso i gestionali esistenti diventa una feature prioritaria e non un "nice to have" di Anno 2).

### 2.5.3 Matrice di posizionamento

Assi: **copertura geografica** (impianto singolo ↔ nazionale) × **specializzazione** (sport generico ↔ verticale tiro).

```
              VERTICALE TIRO
                    ▲
                    │
  GESTIT ●          │          ◆ POLIGONI ITALIA
  T.A.R.G.E.T. ●    │            (quadrante vuoto)
  Esposito ●        │
  Booking TSN ●     │
                    │
IMPIANTO ───────────┼─────────────────► NAZIONALE
 SINGOLO            │
                    │
  ArMa ●            │          ● Anolla
                    │          ● PrenotaUnCampo
                    │          ● Ticketinghub
                    ▼
              SPORT GENERICO
```

Il quadrante alto-destra (**verticale sul tiro + copertura nazionale**) è effettivamente libero. È un claim più circoscritto di "first-mover", e a differenza di quello è vero e verificabile.

### 2.5.4 Difendibilità

Un quadrante vuoto non è un fossato. Va detto con onestà: **le barriere all'ingresso iniziali sono basse.** La difendibilità si costruisce nel tempo, in quest'ordine:

1. **Dati proprietari** — il censimento aggiornato di orari, listini, calibri e discipline di 300+ strutture non esiste oggi in nessun database. Costruirlo richiede mesi di lavoro sul campo, non capitale;
2. **Effetto di rete a due lati** — sopra una massa critica locale, il gestore va dove sono i tiratori e viceversa;
3. **Relazioni istituzionali** — con UITS post-riforma e con le federazioni;
4. **Conoscenza normativa** — la gestione di documenti sensibili in un settore vigilato è una barriera reale per un player orizzontale;
5. **Integrazioni** — ogni gestionale integrato è uno switching cost in più.

Nessuna di queste è disponibile al mese 1. Tutte richiedono esecuzione, non idee. È il motivo per cui la roadmap (§11) è costruita sul censimento e sull'onboarding manuale prima che sul prodotto.

### 2.5.5 Nota sul panorama europeo — fuori perimetro dei primi 18 mesi

Una ricerca di mercato dedicata (31 luglio 2026, non citata altrove in questo documento) ha mappato l'ecosistema europeo. Va riportata con la stessa disciplina di verifica usata per il mercato italiano: **è materiale grezzo, non una raccomandazione da adottare**, perché ripete lo stesso errore metodologico già corretto in §1.5 — propone Poligoni Italia come "first-mover" anche a livello europeo, claim che non è stato verificato con lo stesso rigore delle fonti primarie italiane (§2.5.1) e va trattato con lo stesso scetticismo.

| Paese | Operatori individuati | Maturità digitale | Nota |
|---|---|---|---|
| **Regno Unito** | Range Mate, MyGuns UK, ClayArena, National Shooting Centre | Alta | Mercato strutturato, "Home Office approved clubs": barriera regolatoria specifica |
| **Germania** | BookitOne, VERION, StandFrei, High Ready, 36feet | Alta ma frammentata | 15.000+ Schützenvereine (DSB); Waffengesetz molto restrittivo |
| **Polonia** | BookitOne, StrzelApp | Bassa concorrenza | Indicata dalla ricerca come primo target di espansione, ma **senza verifica indipendente della dimensione del mercato o delle barriere normative reali** |
| **Francia** | TirSync, WinTir, ITAC (FFTir), SIA | Media | SIA (tracciamento armi) obbligatorio: barriera tecnica di integrazione |

**Perché questa nota resta breve.** La roadmap di questo piano (§11) è vincolata dal tempo di un fondatore unico e si esaurisce nell'Italia di una provincia pilota per i primi 18 mesi (§5.3-5.4). Ogni riga spesa a pianificare un'espansione in Polonia prima del trigger 4 di §8.6 (playbook replicabile in Italia da persona diversa dal fondatore) è tempo sottratto al problema reale. La tabella resta come riferimento per **quando**, non **se**, si porrà la domanda dell'espansione — verosimilmente non prima dell'Anno 3, e solo dopo aver rifatto per ciascun paese la stessa verifica di fonti primarie condotta qui per l'Italia.

---

# SEZIONE 3: SOLUZIONE E PROPOSTA DI VALORE

## 3.1 Architettura della piattaforma

Impianto a doppio polo confermato dalla v1.0, con un riposizionamento sostanziale del polo B2B.

```
┌─────────────────────────┐        ┌──────────────────────────┐
│   APP MOBILE (B2C)      │        │  POLIGONI MANAGER (B2B)  │
│   iOS / Android / PWA   │◄─API──►│  Web dashboard           │
│                         │  REST  │                          │
│  · Ricerca e mappa      │        │  · Planner linee         │
│  · Prenotazione slot    │        │  · Prenotazioni in arrivo│
│  · Locker documentale   │        │  · Check-in QR           │
│  · Log-book sessioni    │        │  · Export verso          │
│  · Scadenze e alert     │        │    gestionale esistente  │
└─────────────────────────┘        └──────────────────────────┘
                │                              │
                └──────────┬───────────────────┘
                           ▼
         ┌──────────────────────────────────────┐
         │  LIVELLO DATI (asset proprietario)   │
         │  Censimento strutture, orari,        │
         │  listini, calibri, discipline        │
         │  + sistema Spotter di verifica       │
         └──────────────────────────────────────┘
                           │
                           ▼
         ┌──────────────────────────────────────┐
         │  INTEGRAZIONI (Fase 2+)              │
         │  GESTIT · T.A.R.G.E.T. · gestionali  │
         │  proprietari · calendari sezione     │
         └──────────────────────────────────────┘
```

**Il livello dati è il vero prodotto**, non l'app. L'app è l'interfaccia con cui i dati si consumano e si mantengono aggiornati. Chi possiede il censimento aggiornato dei poligoni italiani possiede la posizione difendibile; chi possiede solo un'app possiede del codice replicabile in tre mesi.

## 3.2 Funzionalità, prioritizzate MVP vs evolutive

### Modulo B2C — App Tiratore

| Funzionalità | Fase | Motivazione della priorità |
|---|---|---|
| Ricerca geolocalizzata + mappa | **MVP** | È il problema che nessuno risolve oggi |
| Scheda struttura: orari, listino, calibri, discipline, contatti | **MVP** | Il 70% del valore percepito è qui. Risolve la telefonata anche senza prenotazione |
| Filtri tecnici (calibri, distanze, indoor/outdoor, discipline, noleggio, istruttore) | **MVP** | Discriminante rispetto a qualsiasi directory generica |
| "Chiama / Richiedi disponibilità" (senza booking) | **MVP** | Ponte verso i poligoni non ancora integrati: la copertura conta più della transazionalità |
| Prenotazione slot in tempo reale | **Fase 2** | Richiede il gestore a bordo. Va introdotta solo dove il dato è certo |
| **Modulo "Il Mio Tiro"** (diario, contatore munizioni, analisi gruppi) | **Fase 2-3** | Vedi §3.5. Rimedio strutturale alla bassa frequenza d'uso |
| Locker documentale + alert scadenze | **Fase 2** | Alto valore, alta responsabilità (§14). Non va fatto in fretta |
| Sistema Spotter (segnalazione/verifica dati) | **Fase 2** | Inutile prima di avere una community; dannoso senza anti-abuso |
| Prenotazione servizi accessori (noleggio, bersagli, istruttore) | **Fase 3** | Aumenta lo scontrino, complica il modello dati |
| Community, recensioni, gamification | **Fase 3** | Rischio moderazione elevato in un settore sensibile |

### Modulo B2B — Poligoni Manager

| Funzionalità | Fase | Motivazione |
|---|---|---|
| Scheda struttura auto-gestita (orari, listino, chiusure) | **MVP** | Minimo indispensabile perché il dato resti vivo senza lavoro del fondatore |
| Notifica richieste in arrivo (e-mail/WhatsApp) | **MVP** | Funziona anche per il gestore che non entra mai in dashboard |
| Planner linee e gestione slot | **Fase 2** | Il cuore del prodotto B2B, ma inutile prima che ci siano prenotazioni |
| Check-in QR | **Fase 2** | Con i limiti di responsabilità di §14 |
| Export prenotazioni (CSV/iCal) verso gestionale esistente | **Fase 2 — priorità alta** | **Riposizionamento chiave**: elimina il doppio inserimento, il vero costo nascosto per il gestore |
| Dashboard occupazione e insight | **Fase 3** | Leva di retention e di giustificazione del canone |
| Integrazione API con GESTIT / gestionali | **Fase 3** | Da negoziare come partnership (§7) |
| Direct marketing e push geolocalizzate | **Fase 3** | Richiede massa critica di utenti |

## 3.3 Proposta di valore

**Per il tiratore:**
> Sapere in dieci secondi dove puoi sparare oggi, con quale calibro e a che prezzo — senza telefonare a cinque poligoni.

**Per il gestore:**
> Riempi le linee vuote con clienti che oggi non ti trovano, senza cambiare il sistema che già usi e senza pagare finché non ti portiamo qualcuno.

Entrambe deliberatamente prive di parole come *ecosistema*, *rivoluzionare*, *piattaforma integrata*. Le formulazioni proposte dalle revisioni Grok/DeepSeek — *"il primo ecosistema digitale nazionale che connette in tempo reale tiratori e poligoni, trasformando un'esperienza frammentata e analogica in un percorso fluido, trasparente e sicuro"* — descrivono l'ambizione, non il prodotto del primo giorno. Un direttore di poligono che ha quindici minuti da dedicare a un venditore non compra un ecosistema.

### Elementi differenzianti difendibili

| Elemento | Difendibile? | Nota onesta |
|---|---|---|
| Copertura nazionale trasversale | **Sì** | Nessun operatore la offre. Da costruire, non è data |
| Verticalità sul tiro (calibri, discipline, documenti) | **Sì** | Barriera reale per un player orizzontale come Anolla |
| Neutralità (non legata a federazione o marca) | **Sì, ma fragile** | Diventa un problema se serve un endorsement UITS post-riforma. Va gestita, non proclamata |
| Complementarità ai gestionali esistenti | **Sì** | È il posizionamento più forte del piano |
| Community e gamification | **No** | Non difende nulla finché non c'è massa critica. Non usarlo come argomento con investitori |
| First-mover | **No** | Rimosso (§1.5) |

## 3.4 User journey

### Il tiratore — Marco, 34 anni, occasionale, vuole sparare sabato

| Fase | Oggi | Con Poligoni Italia | Metrica |
|---|---|---|---|
| Innesco | Impulso il giovedì sera | Idem | — |
| Ricerca | Google → siti datati, orari incerti, gruppi Facebook | Apre l'app, vede 4 poligoni entro 40 km con orari verificati | Time-to-first-result < 15 s |
| Verifica | Telefona venerdì mattina (se ricorda, se il poligono risponde) | Vede calibro ammesso, listino, disponibilità sabato | — |
| Decisione | Spesso rinuncia o rimanda | Sceglie e prenota | **Liquidity rate** |
| Prenotazione | Telefonata, conferma verbale, nessuna traccia | Slot confermato, promemoria, aggiunta al calendario | Time-to-booking < 3 min |
| Arrivo | Coda, verifica manuale documenti | Check-in QR, documenti già validati a monte | Tempo di ingresso |
| Dopo | Nulla | Sessione nel log-book, alert scadenza documenti | Ritorno a 90 giorni |

**Il punto di rottura è la fase di verifica.** È lì che oggi si perde la maggior parte della domanda occasionale: non per prezzo o per distanza, ma per attrito informativo. Da qui la scelta di §3.2 di rilasciare in MVP la scheda informativa completa **anche senza prenotazione**: risolve già l'80% del problema per il 100% delle strutture, mentre la prenotazione risolve il 100% del problema per il 5% delle strutture.

### Il gestore — Sezione TSN media, 600 tesserati, un segretario part-time

| Fase | Oggi | Con Poligoni Italia |
|---|---|---|
| Scoperta | — | Contatto diretto del fondatore, o segnalazione di un tesserato |
| Valutazione | Diffidenza: "l'ennesimo software" | "Non devi cambiare niente e non paghi niente" |
| Attivazione | — | Scheda compilata insieme in 30-45 minuti, prima verifica dati |
| Primo valore | — | Prima richiesta da un tiratore mai visto prima, via e-mail/WhatsApp |
| Adozione | — | Passa al planner quando il volume rende scomodo il quaderno |
| Espansione | — | Attiva Pro quando il valore è misurabile sui suoi numeri |

**Il momento decisivo è "primo valore"**: la prima prenotazione da un tiratore nuovo. Tutto il go-to-market (§5) è ottimizzato per accorciare la distanza tra attivazione e primo valore, perché è lì che si decide il churn dei gestori.

---

## 3.5 Modulo "Il Mio Tiro" — diario, contatori e analisi delle sessioni

### 3.5.1 Perché questo modulo cambia il piano

Il piano fin qui aveva un problema strutturale dichiarato in §13.2: **2,8 prenotazioni per utente all'anno**. Con quella frequenza l'app viene disinstallata tra un utilizzo e l'altro, e il valore per l'utente si esaurisce nel momento della prenotazione.

Un modulo di diario e analisi ribalta la situazione, perché sposta il valore **dopo** la sessione e **tra** una sessione e l'altra: si apre l'app per registrare i risultati, per controllare le scorte, per confrontare i gruppi, per verificare una scadenza. Trasforma uno strumento transazionale in uno strumento personale — e gli strumenti personali, una volta popolati di dati propri, si abbandonano molto più difficilmente.

C'è però un secondo effetto, meno ovvio e più importante: **il diario genera il dato che rende difendibile l'intera piattaforma**. Una prenotazione dice dove sei andato. Un diario dice cosa spari, quanto spari, con che frequenza, con quali risultati. È l'unica base su cui si possono costruire raccomandazioni sensate, targeting pubblicitario di valore (§4.3) e servizi di terze parti.

### 3.5.2 Il panorama competitivo di questo specifico modulo

Va detto subito, perché è il punto in cui è più facile sbagliare investimento: **questo mercato è già affollato di prodotti maturi e specializzati.**

| Prodotto | Origine | Cosa fa | Maturità |
|---|---|---|---|
| **TargetScan – Pistol & Rifle** (Deep Scoring Ltd) | UK | Scoring da foto del bersaglio, oltre 80 discipline ISSF, calcolo di deriva, alzo, raggio medio ed estensione del gruppo | Molto alta, sul mercato da oltre un decennio |
| **MyGuns** | **Svizzera** | Diario sessioni, colpi sparati, inventario armi con matricole e documenti, scorte munizioni scalate automaticamente, dati balistici (V0, ES, SD), cifratura AES-256 zero-knowledge | Alta. Non fa prenotazioni e non gestisce i limiti legali italiani |
| **ML Armory** | **Italia** | Inventario armi/munizioni/componenti di ricarica dal catalogo integrato, cassaforte con conteggio preciso, **ricette di ricarica con scalaggio automatico dei componenti**, registro sessioni (data, colpi, munizioni, meteo, bersagli con colpi e punteggio), **cronografia** (salvataggio test di velocità), obiettivi/traguardi, unità di misura personalizzabili. Nessun account, nessun tracciamento, dati locali + sync iCloud/CloudKit | **Alta — il concorrente più vicino in assoluto.** Italiano, in italiano, lanciato nel 2025. Vedi §3.5.3-bis: non fa prenotazioni, non ha relazione coi poligoni, non gestisce i limiti dell'art. 97 TULPS, solo iOS (Android 2027) |
| **Shotlog** | Internazionale | Punteggio dal vivo, serie, statistiche, registro manutenzione, timer, sincronizzazione cloud. Free + Pro. **Nessuno scoring da foto** | Alta |
| **ShotScore / Notch** | USA | Rilevamento automatico dei fori e punteggio da foto, ML on-device | Recenti ma già funzionanti |
| **MantisX / TitanX** | USA | Analisi del movimento dell'arma con sensore (giroscopio + accelerometro), dry fire e live fire | Molto alta. **Hardware**: territorio diverso |
| **Armorer Pro, Barrel Burner, Zeroed, ShotStat** | USA | Conteggio colpi, vita della canna, promemoria di manutenzione, costo per colpo | Alta, molto frammentata |
| **Beretta Shooting Data, Cognitive Skills** | Italia | Diario, condizioni fisiche e mentali, processo cognitivo | Nicchia |

**Tre conclusioni operative.**

1. **Costruire un motore di scoring da foto per competere con TargetScan è una battaglia sbagliata.** Ha dieci anni di vantaggio, 80 discipline codificate e un pubblico fedele. Il valore incrementale di una copia peggiore è vicino a zero.
2. **ML Armory, non MyGuns, è il concorrente da guardare per primo.** È italiano, in italiano, lanciato nel 2025 — più vicino di MyGuns per lingua, mercato e freschezza del prodotto. Fa quasi esattamente il diario e l'inventario che il modulo "Il Mio Tiro" prevede, con una funzione in più che il piano attuale non copriva (le ricette di ricarica, vedi §3.5.3-bis). Ma **non ha i poligoni**, non prenota, e non gestisce i limiti dell'art. 97 TULPS né il libretto GPG.
3. **Il vantaggio non sta in nessuna di queste funzionalità presa da sola.** Sta in due cose che nessun concorrente può replicare senza costruire prima il lato B2B della piattaforma.

### 3.5.3-bis ML Armory, funzione per funzione: cosa vale la pena riprendere

ML Armory è un'app iOS di inventario privato e registro di tiro, **senza account, senza tracciamento pubblicitario o di terze parti, nessun marketplace**: dati archiviati localmente e sincronizzati via Apple iCloud/CloudKit. È il prodotto italiano più simile a quello che il modulo "Il Mio Tiro" vuole essere sul lato diario/inventario, e va analizzato in dettaglio proprio per questo — è il metro di paragone più diretto disponibile.

| Funzione ML Armory | Presente nel piano attuale (§3.5.6)? | Decisione |
|---|---|---|
| Tracciamento armi dal catalogo (armi, munizioni, componenti, ottiche) con foto | Sì — inventario armi (T4) | Confermato, nessuna modifica |
| Cassaforte con conteggio preciso di colpi e componenti | Sì — inventario munizioni con soglie art. 97 (T4) | Confermato. Il nostro contatore ha in più le soglie di legge, che ML Armory non ha |
| **Ricette di ricarica**, con scalaggio automatico dei componenti dalla cassaforte | **No** — assente dal piano | **Da aggiungere**, vedi sotto |
| Registro sessioni (data, colpi, munizioni, meteo, bersagli con colpi e punteggio) | Sì — sessione auto-generata + contatore colpi (T4) | Confermato. La nostra leva resta superiore: ML Armory richiede inserimento manuale della data e della struttura, noi li precompiliamo dal check-in (§3.5.3, Leva 1) |
| **Cronografia** — salvataggio dei test di velocità (V0) | **No** — assente dal piano | **Da aggiungere**, vedi sotto. MyGuns la offre come dato balistico esteso (V0, ES, SD); ML Armory la offre come funzione singola più semplice |
| Obiettivi/traguardi basati su allenamento e collezione | No — la gamification è deliberatamente rimandata (§13.3) | **Confermata l'esclusione**: la motivazione di §13.3 (frequenza troppo bassa per un ciclo di rinforzo) vale identica qui |
| Unità di misura personalizzabili | No, dettaglio minore | Da valutare in fase di design UI, non è una funzione di prodotto |
| Manutenzione programmata (pulizia, molle) | Sì — manutenzione arma per numero di colpi (T5) | Confermato |
| Nessun account, dati solo locali | Non applicabile: la nostra leva è la sessione auto-generata dal check-in, che richiede un account e un server. **Non è un'opzione che possiamo copiare senza perdere la leva 1** | Vedi §3.5.8 per l'implicazione sulla privacy |

**Due funzioni da aggiungere alla roadmap del modulo, entrambe assenti dal piano fin qui:**

- **Ricette di ricarica con scalaggio automatico.** Per il segmento di tiratori che ricaricano le proprie munizioni — una nicchia già identificata come "competente e fedele, ma piccola" in §3.5.6 — è la funzione che chiude il cerchio tra inventario e consumo: l'utente definisce una ricetta (bossolo, polvere, innesco, palla in quantità fisse) e ogni ricarica scala automaticamente i componenti dalla cassaforte, invece di far scalare solo le cartucce finite. ML Armory dimostra che la domanda esiste in Italia abbastanza da giustificare una feature dedicata;
- **Cronografia — salvataggio dei test di velocità.** Un campo dati semplice (V0, eventualmente data e condizioni), collegato alla sessione. Non richiede hardware proprio: registra un valore che il ricaricatore ha già misurato con un cronografo esterno. Utile soprattutto insieme alla ricetta di ricarica, per correlare la ricetta usata alla velocità ottenuta.

**Dove vanno inserite, con lo stesso rigore RICE usato altrove (§11.3).** Nessuna delle due tocca un pubblico ampio: ricaricano una minoranza dei tiratori. Reach basso, quindi RICE basso — coerente con la nicchia "dati balistici avanzati per ricaricatori" già classificata come Anno 2 in §3.5.6. **Non vanno anticipate a T4/T5**: si aggiungono alla riga esistente "Dati balistici avanzati (V0, ES, SD) per ricaricatori — Anno 2" di §3.5.6, che va riletta come comprensiva anche di ricette di ricarica e cronografia, non come una voce isolata. Anticiparle significherebbe ripetere l'errore già segnalato in Allegato C: aggiungere ore senza toglierne altrove, su un piano che eccede già la capacità sostenibile del fondatore.

### 3.5.3 Le due leve difendibili

**Leva 1 — La sessione si crea da sola.**

Ogni app di diario esistente, senza eccezioni, richiede all'utente di aprire l'app e inserire manualmente la sessione. È il motivo per cui i diari di tiro vengono abbandonati dopo tre voci: la registrazione è un lavoro che si fa quando si è stanchi, appena finito di sparare.

Poligoni Italia sa che sei stato al poligono, perché hai prenotato e hai fatto il check-in. La sessione può essere **pre-compilata automaticamente**: data, struttura, linea, distanza, orario, durata. All'utente resta da aggiungere solo ciò che il sistema non può sapere — arma, colpi, risultati.

> Nessun concorrente può fare questo, perché nessun concorrente ha la relazione con il poligono. È l'unico vantaggio di prodotto strutturalmente non copiabile dell'intero piano.

**Leva 2 — Il diritto italiano non è un dettaglio, è la funzione.**

Nessuna app internazionale gestisce gli obblighi italiani, perché non ha ragione di conoscerli. Sono invece obblighi con conseguenze penali e amministrative reali, e riguardano esattamente il dato che il diario raccoglie: quante munizioni hai, quante ne hai consumate, quando sei andato al poligono.

### 3.5.4 Il contatore munizioni conforme all'art. 97 TULPS

**È la funzionalità più preziosa dell'intero modulo**, e nessuno la offre.

L'articolo 97 del TULPS fissa limiti non derogabili alla detenzione di munizioni:

| Tipo | Limite | Note |
|---|---|---|
| Cartucce per arma corta (pistola/rivoltella) | **200** | Limite non derogabile senza licenza prefettizia |
| Cartucce per arma lunga da caccia (a palla) | **1.500** | Idem |
| Cartucce a pallini (spezzone) | **1.000 senza denuncia**, fino a **1.500** | Obbligo di denuncia oltre i 1.000 pezzi |
| Polvere da sparo | **2 kg** | — |

*Fonte: art. 97 TULPS; sintesi divulgativa su all4shooters.it e Gazzetta delle Armi.*

Superare i limiti senza licenza della Prefettura è un illecito. Il problema pratico è che **il tiratore medio non tiene il conto**: compra scatole in momenti diversi, consuma al poligono, ricarica, e la contabilità reale è affidata alla memoria.

Il modulo risolve esattamente questo:

- Inventario per tipologia e calibro, con **soglia legale precaricata** per categoria;
- Scarico automatico dei colpi consumati al termine di ogni sessione;
- Carico all'acquisto, con foto dello scontrino se l'utente vuole;
- **Avviso all'80% della soglia** ("Stai per raggiungere il limite di 200 cartucce per arma corta") e blocco visivo al superamento;
- Promemoria dell'obbligo di denuncia per lo spezzone oltre i 1.000 pezzi.

Con una **avvertenza da mantenere in ogni schermata**: lo strumento è di ausilio al calcolo, non una certificazione di conformità. La responsabilità della detenzione resta integralmente del detentore. È la stessa logica adottata per il locker documentale in §14.5, e per la stessa ragione.

Questa funzionalità, da sola, giustifica l'installazione dell'app anche per un tiratore che non prenoterà mai online — il che la rende un canale di acquisizione, non solo di retention.

### 3.5.5 Il libretto di tiro digitale per le guardie giurate

Un secondo caso d'uso, individuato dalla ricerca normativa, con un profilo commerciale insolitamente forte:

Le Guardie Particolari Giurate in servizio hanno l'**obbligo di legge** di iscriversi a una sezione TSN e di sostenere **tre esercitazioni all'anno con cadenza quadrimestrale**, di 50 colpi ciascuna, l'ultima con raggiungimento di un punteggio minimo e rilascio del patentino. Le esercitazioni sono annotate su un **libretto di tiro** personale.
*Fonte: DM 1 dicembre 2010 n. 269 e normativa UITS sul porto d'armi per guardie giurate.*

Il profilo di questo segmento è quanto di più favorevole possa esistere per una piattaforma di prenotazione:

| Caratteristica | Valore |
|---|---|
| Dimensione | 44.347 porti d'arma per guardie giurate (2025), **in crescita** (+1.958 sul 2024) |
| Frequenza | 3 sessioni/anno **obbligatorie**, contro le 2,8 volontarie della media |
| Elasticità della domanda | **Nulla**: è un obbligo, non una scelta |
| Costo di dimenticanza | Alto: il mancato adempimento incide sul porto d'armi e sull'idoneità al servizio |
| Prevedibilità | Totale: cadenza quadrimestrale da data certa |
| Chi paga | Spesso l'istituto di vigilanza, non la guardia: **è un cliente B2B travestito da B2C** |

Funzionalità dedicate: libretto digitale con le tre scadenze quadrimestrali calcolate dalla data sul porto d'armi, alert a 60/30/7 giorni, prenotazione diretta della sessione presso la sezione di iscrizione, storico dei punteggi, esportazione in PDF per l'istituto.

**Implicazione di go-to-market non prevista nel piano originale**: gli istituti di vigilanza sono un canale B2B a sé, con decine di guardie ciascuno e un problema amministrativo reale (tenere traccia degli adempimenti di tutto il personale). Un accordo con un singolo istituto porta decine di utenti attivi ricorrenti in un colpo solo. **Va aggiunto alla mappa delle partnership** (§7).

### 3.5.6 Funzionalità del modulo, per fase

| Funzionalità | Fase | Note |
|---|---|---|
| **Sessione auto-generata dalla prenotazione** | **T4** | Leva 1. Con conferma dell'utente, mai automatica in silenzio |
| **Sessione manuale** (anche per poligoni non partner) | **T4** | Fondamentale: il diario deve funzionare ovunque, o non viene adottato |
| **Contatore colpi per arma e per sessione** | **T4** | Base di tutto il resto |
| **Inventario munizioni con soglie art. 97 TULPS** | **T4** | Leva 2. La funzionalità di punta del modulo |
| Inventario armi (senza matricole — vedi §3.5.7) | T4 | — |
| Costo per sessione e costo per colpo | T4 | Banale da calcolare, molto apprezzato: nessuno sa quanto spende davvero |
| **Foto del bersaglio con marcatura manuale dei fori** | **T5** | L'utente tocca i fori sullo schermo. Zero ML, effort basso |
| **Statistiche del gruppo**: raggio medio, estensione, deriva e alzo | **T5** | Geometria elementare sui punti marcati. **È l'80% del valore percepito dell'"analisi AI" al 10% dello sforzo** |
| Andamento nel tempo per arma, calibro, distanza | T5 | La ragione per cui si continua a registrare |
| **Libretto di tiro GPG** con scadenze quadrimestrali | **T5** | Segmento ad alta frequenza e domanda obbligata |
| Manutenzione arma per numero di colpi (pulizia, usura canna) | T5 | Promemoria automatici su soglie impostabili |
| Esportazione PDF/CSV del diario | T5 | Anti-lock-in dichiarato: aumenta la fiducia, riduce l'attrito d'ingresso |
| **Rilevamento automatico dei fori dalla foto** | **T6+** | Solo se le metriche d'uso di T5 lo giustificano. Vedi sotto |
| Confronto anonimo con tiratori simili (calibro, distanza, disciplina) | Anno 2 | Richiede massa critica |
| Condivisione sessione con accompagnatore o istruttore | Anno 2 | — |
| Dati balistici avanzati: **ricette di ricarica con scalaggio automatico**, **cronografia** (V0, ES, SD) | Anno 2 | Nicchia competente e fedele, ma piccola. Validata da ML Armory (§3.5.3-bis): funzionalità che l'app italiana più simile alla nostra offre già, quindi la domanda esiste, ma resta di nicchia — non giustifica un'anticipazione a T4/T5 |
| Analisi del movimento con sensore | **Mai** | Territorio MantisX: richiede hardware. Fuori perimetro |

### 3.5.7 Sull'"analisi AI dei bersagli": cosa fare davvero

La richiesta di un'analisi automatica dei bersagli è ragionevole, ma va scomposta, perché contiene due cose molto diverse con costi separati da un ordine di grandezza.

| | **Marcatura manuale + statistiche** | **Rilevamento automatico dei fori** |
|---|---|---|
| Cosa fa l'utente | Fotografa il bersaglio e tocca i fori | Fotografa il bersaglio |
| Tecnologia | Geometria su coordinate | Visione artificiale, modello addestrato |
| Sforzo di sviluppo | **~2 settimane** | **~8-12 settimane** + raccolta dataset + iterazione continua |
| Affidabilità | 100% (l'utente è la fonte) | 70-90%, degrada con luce, angolo, bersagli sovrapposti, fori doppi |
| Output | Raggio medio, estensione, deriva, alzo, dispersione, andamento | Gli stessi, più il punteggio |
| Valore percepito | **Alto** | Alto |
| Differenziazione | Nessuna, ma nessuno se ne accorge | Nessuna: TargetScan lo fa da dieci anni meglio |

**Raccomandazione: partire dalla marcatura manuale in T5 e trattare il rilevamento automatico come un'ipotesi da validare, non come un obiettivo.** Il criterio di attivazione dev'essere un dato d'uso, non l'entusiasmo per la tecnologia:

> Si sviluppa il rilevamento automatico solo se, dopo tre mesi dal rilascio della marcatura manuale, **almeno il 25% degli utenti attivi ha caricato più di 5 bersagli**. Sotto quella soglia, il problema non è il tempo di marcatura: è che la funzione non interessa abbastanza, e automatizzarla non la renderebbe interessante.

Vale la pena di aggiungere la ragione strutturale, perché è la stessa che attraversa tutto questo piano: **un fondatore unico con ~15 ore a settimana non può permettersi 12 settimane su una funzionalità che tre concorrenti offrono già meglio.** Le stesse 12 settimane spese sul contatore munizioni conforme, sul libretto GPG e sull'integrazione coi gestionali producono tre cose che *nessuno* offre. La scelta non è tra fare o non fare l'analisi dei bersagli: è tra fare la versione al 10% del costo, o costruire la copia peggiore di TargetScan.

Se in seguito il rilevamento automatico si rivelasse necessario, la strada corretta è quasi certamente **integrare o acquisire**, non ricostruire: alcuni di questi operatori sono piccoli e potrebbero avere interesse a una distribuzione italiana.

### 3.5.8 Un avvertimento sui dati: perché le matricole non vanno archiviate

Un archivio digitale che associ **nome, indirizzo, armi detenute e loro matricole** è, in caso di violazione, un elenco operativo per chi volesse rubare armi. Non è un rischio teorico: è la ragione per cui MyGuns adotta la cifratura zero-knowledge come argomento di vendita principale.

Impostazione adottata, deliberatamente più conservativa:

1. **Nella versione iniziale non si archiviano numeri di matricola**, né documenti di detenzione, né denunce. L'arma si registra come "Pistola 9×21 — Beretta 92" senza identificativi univoci: è sufficiente per contare colpi, scalare munizioni e calcolare statistiche, che è tutto ciò che serve al diario;
2. Se in seguito emergesse una domanda reale per l'inventario completo, va rilasciato **solo** con cifratura lato client a chiave derivata dall'utente (zero-knowledge), in cui il server non può in alcun caso leggere il dato;
3. **Il dato aggregato di detenzione non viene mai usato per targeting pubblicitario**, indipendentemente dal consenso raccolto. È una linea che non conviene superare né sul piano etico né su quello reputazionale, in un settore in cui un solo incidente di questo tipo chiuderebbe il progetto;
4. Il contatore munizioni conserva **quantità e calibro**, non provenienza né estremi di acquisto.

Questa scelta costa una funzionalità che un concorrente offre. Ne vale la pena: è l'unico ambito del piano in cui un errore tecnico si trasforma in un danno a terzi.

**Un chiarimento sul confronto con ML Armory (§3.5.3-bis).** ML Armory risolve il problema della violazione dati alla radice: nessun account, dati solo locali più sync iCloud, il server dell'app non vede mai nulla. È l'approccio più sicuro possibile, e non è replicabile qui senza rinunciare alla leva 1 (§3.5.3): la sessione precompilata dal check-in richiede che il server sappia che un utente ha prenotato in una certa struttura in un certo momento — un dato che, per definizione, non può restare solo sul dispositivo. **La scelta non è tra "sicuro come ML Armory" e "meno sicuro": è tra un prodotto senza la leva differenziante e un prodotto con la leva, che tratta il dato server-side col massimo rigore possibile** (minimizzazione, niente matricole, niente targeting). Va detto con chiarezza a ogni revisione di sicurezza, perché è la ragione per cui questo modulo non può semplicemente "fare come ML Armory" sul fronte privacy.

### 3.5.9 Effetti sul resto del piano

| Ambito | Effetto |
|---|---|
| **Retention B2C** (§13.2) | È il rimedio strutturale alla bassa frequenza. Retention a 90 giorni attesa **+10-15 punti** |
| **Pass Pro** (§4.3) | Il modulo diventa il contenuto reale dell'abbonamento, che prima era sottile. Conversione stimata rivista **dal 3% al 5%** |
| **Acquisizione** | Il contatore munizioni è utile anche a chi non prenota: allarga il bacino oltre i tiratori "prenotanti" |
| **Segmento GPG** | Nuovo segmento a domanda obbligata, con canale B2B dedicato (istituti di vigilanza) |
| **Dato proprietario** (§2.5.4) | Rafforza la difendibilità: consumi e frequenze reali per calibro e disciplina non esistono in nessun database italiano |
| **Advertising** (§4.3) | Rende il canale sensato: un'inserzione di munizioni a chi sta esaurendo quel calibro vale un ordine di grandezza più di un banner generico. **Da attivare solo con consenso esplicito e senza mai usare i dati di detenzione** |
| **Compliance** (§14) | Alza il livello di rischio: la DPIA deve coprire anche il diario. Vedi §14.2 |
| **Sviluppo** | **+13 settimane-uomo lorde, +10 nette** sul piano a 18 mesi. Il piano passa da 60 a 70 settimane e **supera la capacità del fondatore**: vanno rinviate app nativa e Spotter per compensare. Dettaglio e opzioni in Allegato C |

---

# SEZIONE 4: MODELLO DI MONETIZZAZIONE

## 4.1 Il principio: sequenza prima che prezzo

La divergenza più netta tra le revisioni ricevute riguarda l'attivazione dei canali di ricavo. Grok/DeepSeek propongono i quattro canali dal lancio (SaaS 39€→69€, fee ibrida, Pass Pro, advertising); la revisione Claude propone la sola transaction fee per i primi 3-6 mesi.

**Decisione: sequenza a fasi con trigger quantitativi**, più vicina alla seconda posizione ma con due modifiche.

Le motivazioni, in ordine di peso:

1. **Il canone compete frontalmente con l'incumbent, la fee no.** Un gestore che paga già GESTIT valuta un secondo canone come costo aggiuntivo su un budget IT che considera saturo. Una commissione su prenotazioni che prima non esistevano non ha questo problema: è una quota di ricavo incrementale;
2. **Quattro leve sullo stesso ecosistema creano attrito su entrambi i lati insieme.** Chiedere al gestore un canone *e* prendere una fee sui suoi clienti *e* vendere un abbonamento agli stessi clienti è la prima obiezione che un gestore scettico solleverà;
3. **Ogni canale attivo è codice, contabilità e supporto.** Per un fondatore unico con tempo limitato (§10), quattro canali al mese 1 significano quattro cose fatte male;
4. **Ma la fee non può essere il primo canale.** Qui mi discosto anche dalla revisione Claude: attivare i pagamenti richiede che il gestore accetti il prepagamento, cosa che la maggior parte oggi non fa. La prima fase deve essere **a ricavo zero**, con il solo obiettivo di dimostrare che la domanda esiste.

## 4.2 Sequenza di attivazione con trigger

| Fase | Periodo indicativo | Canali attivi | **Trigger per passare alla fase successiva** |
|---|---|---|---|
| **F0 — Zero ricavi** | Mesi 1-7 | Nessuno. Scheda gratuita, richieste inoltrate al gestore | ≥5 poligoni con ≥20 richieste/mese ciascuno per 2 mesi consecutivi |
| **F1 — Transaction fee** | Mesi 8-14 | Fee sulle prenotazioni prepagate | ≥10 poligoni con ≥50 prenotazioni/mese **e** liquidity rate >15% |
| **F2 — SaaS B2B Pro** | Mesi 15-24 | + abbonamento gestori | ≥1.000 utenti attivi mensili **e** ≥35% di essi che registra sessioni nel diario (§3.5) |
| **F3 — Pass Pro B2C** | Da mese ~17 | + abbonamento tiratori, con il modulo "Il Mio Tiro" come contenuto | ≥10.000 utenti registrati |
| **F4 — Advertising** | Anno 3 | + pubblicità e sponsorizzazioni | — |

I trigger sono la parte importante di questa tabella. Servono a impedire la decisione più comune e più dannosa in questa fase: attivare un canale perché serve fatturato, non perché il canale è pronto.

## 4.3 Struttura dei ricavi a regime

| Canale | Target | Prezzo | Benchmark e motivazione |
|---|---|---|---|
| **Transaction fee** | Tiratore (fase iniziale) | **1,00 € fisso + 2% del valore** ≈ 1,50 € su prenotazione media da 25 € | Modello ibrido: il fisso copre il costo Stripe (~0,25 € + 1,5%), la percentuale scala con il valore. **Pagata dal tiratore ed esposta in chiaro**: il gestore incassa l'intero importo, che azzera l'attrito sul lato collo di bottiglia |
| **SaaS B2B Pro** | Gestori | **39 €/mese** early adopter (primi 50, bloccato a vita) → **59 €/mese** a regime | Sotto i 69 € proposti da Grok/DeepSeek. Motivo: è un **secondo** software, non il primo. Deve stare sotto la soglia di approvazione autonoma di un direttore senza passare dal consiglio direttivo |
| **SaaS B2B Enterprise** | Grandi sezioni, poligoni multi-linea | Da 149 €/mese, custom | Include integrazione col gestionale esistente e supporto dedicato |
| **Pass Pro B2C** | Tiratori abituali | **2,99 €/mese o 24,99 €/anno** | Confermato dalla v1.0. Le revisioni proponevano 19,99 €/anno: mantengo 24,99 € perché uno sconto annuale del 30% è già sufficiente e non c'è ragione di sacrificare margine su un canale non ancora validato |

### Che cosa contiene davvero il Pass Pro

Nella v1.0 il Pass Pro offriva cancellazione last-minute, promemoria e convenzioni: un pacchetto sottile, che difficilmente giustifica un abbonamento ricorrente. Con il modulo "Il Mio Tiro" (§3.5) l'abbonamento acquista un contenuto reale.

| | **Gratuito** | **Pass Pro** (2,99 €/mese) |
|---|---|---|
| Ricerca, mappa, schede, prenotazione | ✓ | ✓ |
| Diario sessioni | ultime 10 | illimitato con storico completo |
| Contatore munizioni con soglie di legge | ✓ (1 calibro) | tutti i calibri, avvisi personalizzati |
| Bersagli caricati e analisi del gruppo | 3/mese | illimitati |
| Statistiche e andamento nel tempo | base | complete, per arma/calibro/distanza |
| Libretto di tiro GPG con scadenze | — | ✓ + esportazione PDF |
| Promemoria scadenze documentali | ✓ | ✓ con anticipo personalizzabile |
| Cancellazione gratuita last-minute | — | ✓ |
| Esportazione dati | — | ✓ |

Il contatore munizioni resta **gratuito per un calibro** per una ragione precisa: è la funzione di sicurezza legale del prodotto, e metterla interamente a pagamento sarebbe sbagliato oltre che controproducente — è anche il miglior motivo per installare l'app.
| **Advertising** | Aziende di settore | CPM + pacchetti sponsorizzazione | Non quantificabile in modo credibile prima di conoscere il traffico. Le cifre delle revisioni (500 €/mese banner, 5.000 €/evento) sono invenzioni: **le ometto** |

### Piano Free per i gestori — cosa include davvero

Le revisioni Grok/DeepSeek propongono "fino a 5 prenotazioni/mese gratuite" nel piano Free. **Respingo questa impostazione**: mettere un tetto alle prenotazioni gratuite significa mettere un tetto alla liquidità del marketplace nella fase in cui la liquidità è tutto. Un gestore che rifiuta la sesta prenotazione del mese è un gestore che produce un'esperienza pessima per il tiratore e un dato falso per la piattaforma.

| | **Free** (sempre) | **Pro** (39-59 €/mese) | **Enterprise** |
|---|---|---|---|
| Scheda pubblica completa | ✓ | ✓ | ✓ |
| Prenotazioni ricevute | **illimitate** | illimitate | illimitate |
| Notifica richieste (e-mail/WhatsApp) | ✓ | ✓ | ✓ |
| Auto-gestione orari e listino | ✓ | ✓ | ✓ |
| Planner linee e gestione slot | — | ✓ | ✓ |
| Check-in QR | — | ✓ | ✓ |
| Export verso gestionale esistente | — | ✓ | ✓ |
| Dashboard occupazione e insight | — | ✓ | ✓ |
| Push geolocalizzate ai tiratori | — | limitate | illimitate |
| Integrazione API dedicata | — | — | ✓ |
| Supporto | community | e-mail 48h | dedicato |

Il confine tra Free e Pro non è il **volume**, è il **risparmio di lavoro**. Il Free porta clienti; il Pro fa risparmiare tempo al gestore. È la separazione giusta perché allinea il ricavo al valore percepito, invece di penalizzare proprio il gestore che sta usando meglio la piattaforma.

## 4.4 Unit economics

Calcolate, non citate. Ogni riga è ricostruibile.

### Lato gestore (B2B)

| Voce | Valore | Derivazione |
|---|---|---|
| ARPU Pro a regime | **59 €/mese** = 708 €/anno | Listino |
| Margine lordo | **~88%** | Costi variabili: hosting e supporto ≈ 7 €/mese per gestore |
| Churn mensile atteso a regime | **3,0%** | Stima prudenziale: durata media 33 mesi |
| **LTV gestore** | **≈ 1.710 €** | 59 € × 0,88 × 33 mesi |
| CAC monetario (bootstrap) | **50-100 €** | Trasferta + materiali. Nessun costo di vendita retribuito in Anno 1 |
| **CAC in tempo del fondatore** | **4-8 ore** | Contatto, visita, censimento dati, attivazione, follow-up |
| Payback | **< 2 mesi** su cassa | — |
| **LTV/CAC monetario** | **≈ 17×** | Numero apparentemente ottimo, ma vedi sotto |

**Il numero LTV/CAC è ingannevole ed è importante dirlo.** In regime bootstrap il CAC monetario è basso solo perché il costo del lavoro del fondatore è nascosto. Valorizzando le 4-8 ore a 40 €/h, il CAC reale sale a 210-420 € e il rapporto scende a 4-8×. **Il vincolo di questo progetto non è il denaro per acquisire gestori: sono le ore disponibili.** Il KPI che conta è quindi *ore per onboarding* (§9), e il primo investimento sensato è quello che riduce quelle ore — che è la ragione per cui il primo assunto è un BD e non un developer (§10).

### Lato tiratore (B2C)

| Voce | Valore | Derivazione |
|---|---|---|
| Prenotazioni per utente attivo | **2,8/anno** | Media pesata sui profili di §2.3 |
| Ricavo fee per prenotazione | **1,50 €** | 1,00 € + 2% su scontrino medio 25 € |
| Ricavo fee per utente/anno | **4,20 €** | — |
| Conversione a Pass Pro | **5%** a regime | Rivista dal 3% dopo l'introduzione del modulo "Il Mio Tiro" (§3.5.9), che dà all'abbonamento un contenuto ricorrente. Resta prudenziale per un consumer di nicchia |
| Ricavo Pass Pro per utente/anno | **1,25 €** | 5% × 24,99 € |
| **ARPU B2C totale** | **≈ 5,45 €/anno** | — |
| CAC B2C target | **< 3 €** | Canali organici e community (§6); il paid non regge questo ARPU |
| **LTV B2C (3 anni)** | **≈ 14 €** | Con retention 60% anno su anno |

**Implicazione dura ma decisiva: il B2C non si può comprare.** Con un ARPU di circa 5 €/anno, qualsiasi acquisizione a pagamento sopra i 3 € di CAC distrugge valore. Ne consegue che il piano marketing (§6) deve essere costruito su canali organici, community e presidio territoriale, non su advertising. Le revisioni che allocavano 30.000 € di budget marketing in Anno 1, con il 25% in social a pagamento, proponevano di comprare utenti a un multiplo del loro valore.

## 4.5 Chi paga la fee: una scelta da rivedere sui dati

La scelta di far pagare la fee al **tiratore** è deliberata (attrito zero sul lato offerta) ma **non è validata**. È tra le assunzioni critiche del piano. Un tiratore potrebbe considerare inaccettabile pagare 1,50 € per evitare una telefonata gratuita.

Piano B già definito: passare a **commissione sul gestore** (5-8% sul valore della prenotazione, trattenuta all'incasso). Trigger di switch: se in F1 il tasso di abbandono al checkout supera il 25%, o se il liquidity rate cala di oltre 5 punti rispetto alla fase senza pagamento. Test a costo minimo per anticipare la risposta: §Assunzioni Critiche.

---

# SEZIONE 5: STRATEGIA GO-TO-MARKET

## 5.1 Il principio guida

> **Prima l'offerta, poi la domanda.** Senza poligoni con dati reali, un tiratore che apre l'app trova il vuoto — e non torna. Il primo abbandono brucia l'utente per sempre, in un mercato dove il passaparola nella community locale è più veloce di qualsiasi campagna.

Corollario operativo: nella fase iniziale la piattaforma deve avere **copertura informativa alta e transazionalità bassa** (tante schede complete, poche prenotazioni online), non il contrario. È la ragione per cui l'MVP di §3.2 include la scheda informativa di tutte le strutture della zona pilota, comprese quelle non partner.

## 5.2 La risoluzione del problema uovo-gallina

Cinque leve, in ordine di applicazione:

1. **Censimento unilaterale.** I dati pubblici (orari, indirizzo, discipline, listino se pubblicato) si raccolgono **senza chiedere il permesso**: sono informazioni pubbliche. La piattaforma nasce già popolata di 40-60 strutture nella zona pilota, prima di aver firmato un solo accordo. Elimina il lato vuoto del marketplace al giorno 1;
2. **Valore asimmetrico all'inizio.** Nella fase F0 la piattaforma dà valore al gestore (clienti) senza chiedere nulla. È un rapporto volutamente sbilanciato finché non c'è volume;
3. **Concentrazione geografica estrema.** Meglio 15 poligoni in una provincia che 15 sparsi in Italia. La liquidità è locale: un tiratore di Bergamo non prenota a Bari;
4. **Il fondatore come API umana.** Nella F0 il fondatore *è* il sistema di prenotazione: riceve richieste, telefona al gestore, conferma. Costo marginale alto, costo fisso zero, apprendimento massimo;
5. **La community come canale di offerta.** I tiratori segnalano i poligoni mancanti (pre-Spotter, in forma manuale). Ogni segnalazione è al tempo stesso un lead B2B e la prova che esiste domanda per quella struttura — l'argomento di vendita più forte disponibile.

## 5.3 Selezione dell'area pilota: criterio, non lista di città

Le revisioni Grok/DeepSeek indicano Roma, Milano e Bologna. **Respingo la scelta** per tre motivi: sono i mercati con più soluzioni proprietarie già attive (§2.5), le grandi sezioni cittadine hanno cicli decisionali collegiali lunghi, e tre città distanti tra loro sono incompatibili con un fondatore che si sposta di persona nei giorni liberi.

**Criterio di selezione** — una sola provincia (o due contigue), scelta massimizzando:

| Fattore | Peso | Come si misura |
|---|---|---|
| Densità di strutture entro 60 km | 30% | Conteggio da elenco sezioni UITS + mappa poligoni privati |
| Presenza di community locali attive | 25% | Gruppi Facebook, forum, ASD di tiro dinamico con calendario gare pubblico |
| Quota di strutture **senza** booking online proprio | 20% | Verifica sito per sito |
| **Raggiungibilità fisica dal fondatore** | 15% | Andata e ritorno in giornata, compatibile con i turni |
| Presenza di poligoni privati/ASD | 10% | Gli early adopter migliori (§2.4) |

Il quarto fattore è quello che nessuna revisione considera e che nella pratica pesa più degli altri: un fondatore con turni ciclici in servizio non può fare onboarding a 500 km da casa. Un piano che lo ignora non verrà eseguito.

**Output atteso**: una short-list di 3 province con punteggio, da produrre nella settimana 2 (§15).

## 5.4 Fasi di lancio

### Fase A — Censimento e validazione manuale (mesi 1-3)
- Censimento completo delle strutture della provincia pilota: nome, indirizzo, contatti, orari, discipline, calibri, listino, presenza di booking proprio
- Strumenti: **Google Sheet + numero WhatsApp Business**. Nessuna riga di codice
- Contatto diretto: telefonata, poi visita di persona ai 10 più promettenti
- 20 interviste a tiratori nelle community locali e ai poligoni
- **Obiettivo: 10 prenotazioni gestite interamente a mano**

### Fase B — Vetrina pubblica (mesi 4-6)
- Sito/PWA con ricerca, mappa e schede. Nessuna prenotazione online
- Pubblicazione di **tutte** le strutture censite, partner e non
- "Richiedi disponibilità" → inoltro al gestore + notifica al fondatore
- **Obiettivo: 3 poligoni che aggiornano i dati da soli, traffico organico misurabile**

### Fase C — Prenotazione reale (mesi 7-10)
- Booking online su 5 poligoni pilota. Fee non ancora attiva
- App mobile (o PWA installabile) per gli utenti ricorrenti
- **Obiettivo: 50 prenotazioni/settimana, liquidity rate >15%**

### Fase D — Monetizzazione e densità (mesi 11-15)
- Attivazione fee secondo i trigger di §4.2
- Estensione alla regione: 15 → 40 poligoni
- Primo BD part-time (§10)
- **Obiettivo: 40 poligoni, primi ricavi ricorrenti**

### Fase E — Seconda regione (mesi 16-18)
- Replica del playbook in una regione non contigua, per verificare che il modello non dipenda dalle relazioni personali del fondatore
- Attivazione SaaS Pro
- **Obiettivo: playbook documentato e replicabile da persona diversa dal fondatore**

Il criterio di successo della fase E è il più importante di tutti: se il modello funziona solo dove il fondatore conosce le persone, non è un'azienda, è un lavoro.

## 5.5 Canali di acquisizione B2B (gestori)

| Canale | Costo | Efficacia attesa | Note |
|---|---|---|---|
| **Visita diretta** | Tempo + benzina | **Molto alta** | Il canale principale. In un settore diffidente e relazionale, la presenza fisica non è sostituibile |
| **Telefonata a freddo preceduta da e-mail** | Tempo | Media | Serve a fissare la visita, non a chiudere |
| **Introduzione da tiratore cliente** | Zero | **Molto alta** | Un tesserato che chiede al proprio poligono di esserci vale dieci e-mail |
| **Fiere di settore** (EOS Show, HIT Show) | 500-1.500 €/evento | Media-alta | Molti gestori in un posto solo. Da valutare dopo aver avuto qualcosa da mostrare |
| **Comitati regionali UITS** | Tempo | **Alta, post-riforma** | La riforma centralizza: un comitato regionale può aprire molte porte |
| **Partnership con gestionali incumbent** | Negoziazione | **Alta** | §7. Loro hanno la relazione, noi la domanda |
| **Pubblicità B2B online** | € | **Bassa** | Platea di 300 soggetti: il targeting pubblicitario è inefficiente per definizione |

## 5.6 Canali di acquisizione B2C (tiratori)

| Canale | Costo | Efficacia attesa | Note |
|---|---|---|---|
| **SEO su intento locale** ("poligono tiro *provincia*", "dove sparare a *città*") | Tempo | **Molto alta** | Il canale strutturalmente migliore: intercetta domanda esistente a costo marginale zero. Ogni scheda struttura è una pagina indicizzabile |
| **Community di settore** (gruppi Facebook, forum, ASD) | Tempo | **Alta** | Con la cautela dovuta: presenza autentica, non spam promozionale, o si viene espulsi |
| **Passaparola dal poligono** (QR in bacheca, volantino al banco) | Materiali stampati | **Alta** | Il gestore diventa canale di acquisizione B2C. Chiude il ciclo del marketplace |
| **Contenuti utili** (guida al primo accesso, documenti, calibri) | Tempo | Media-alta | Alimenta la SEO e serve il segmento neofita, il più prezioso (§2.3) |
| **ASO** | Tempo | Media | Rilevante solo dopo l'app nativa |
| **Paid social** | € | **Bassa/negativa** | Con ARPU 5 €/anno (§4.4) non regge. Da usare solo per test di messaggio, con budget di poche centinaia di euro |

**Sequenza corretta**: il B2C non va acceso prima della fase C. Portare traffico su una piattaforma senza disponibilità reali è il modo più efficiente di bruciare l'unico bacino di utenti disponibile.

---

# SEZIONE 6: PIANO DI MARKETING E COMUNICAZIONE

## 6.1 Brand positioning

**Posizionamento**: lo strumento pratico e neutrale con cui si trova e si prenota un poligono in Italia. Non un media di settore, non una community, non un rivenditore.

**Tono**: sobrio, tecnico, non spettacolarizzato. Il settore è vigilato e culturalmente sensibile; l'estetica "tattica" o militaresca crea problemi con gli store, con gli investitori e con la stampa generalista, e non serve al pubblico reale, che è sportivo.

| Target | Messaggio chiave | Cosa evitare |
|---|---|---|
| Tiratore occasionale | "Trova dove sparare oggi, senza telefonare" | Gergo tecnico incomprensibile |
| Neofita | "Il primo giorno al poligono: cosa serve, dove andare, quanto costa" | Dare per scontata la conoscenza di discipline e documenti |
| Agonista | "Tutte le strutture, tutte le discipline, orari verificati" | Promettere ciò che già ha |
| Gestore | "Ti portiamo clienti. Non devi cambiare niente e non paghi finché non funziona" | La parola "piattaforma". Promesse di rivoluzione |
| Istituzioni / federazioni | "Uno strumento neutrale di accesso alla pratica sportiva, che aumenta la frequentazione" | Qualsiasi accostamento alla vendita di armi |

## 6.2 Budget per canale — dimensionato sul reale

Il budget riflette lo scenario bootstrap. Le revisioni proponevano 30.000 € in Anno 1: è un ordine di grandezza da azienda finanziata, incompatibile con questo piano e — dato l'ARPU B2C di §4.4 — comunque mal allocato.

| Canale | Anno 1 | Anno 2 | Anno 3 | Note |
|---|---|---|---|---|
| SEO e contenuti | 0 € | 1.500 € | 6.000 € | Tempo del fondatore in Anno 1; copywriter esterno poi |
| Materiali per i poligoni (QR, volantini, adesivi) | 400 € | 1.200 € | 3.000 € | Alto ritorno: trasforma il gestore in canale |
| Trasferte e presidio territoriale | 1.200 € | 3.000 € | 8.000 € | La voce con il miglior ritorno in Anno 1 |
| Fiere di settore | 0 € | 2.500 € | 8.000 € | In Anno 1 partecipazione come visitatore, senza stand |
| Test paid (solo validazione messaggi) | 300 € | 1.500 € | 8.000 € | Budget da esperimento, non da acquisizione |
| PR e rapporti con stampa di settore | 0 € | 800 € | 4.000 € | Armi e Tiro, Armi Magazine, GUNSweek: raggiungono esattamente il pubblico |
| Brand, logo, identità | 600 € | 0 € | 3.000 € | Una volta, fatta bene |
| **Totale** | **2.500 €** | **10.500 €** | **40.000 €** | |

## 6.3 Contenuti e storytelling

Tre filoni, tutti al servizio della SEO e del segmento neofita:

1. **Contenuti di servizio** — "Quanto costa sparare in Italia", "Documenti necessari per il primo accesso", "Differenza tra TSN e poligono privato", "Come funziona il DIMA". Alto volume di ricerca, concorrenza bassa, utilità reale;
2. **Schede struttura come contenuto** — ogni poligono censito è una pagina indicizzabile su query locali. Con 300 strutture sono 300 pagine di long tail: è il motore SEO principale e si costruisce mentre si fa il censimento, a costo zero;
3. **Storie di gestori** — casi concreti ("come la sezione X ha riempito i turni infrasettimanali"). Utili solo dopo aver avuto risultati veri. Non inventarli.

**Sulla riforma UITS**: il settore ne parlerà per tutto il 2026-2027. Produrre contenuti informativi accurati sul DL 108/2026 è un'occasione di autorevolezza a costo zero verso il pubblico B2B. Va fatto con rigore e senza prendere posizione politica: la neutralità è un asset, e la riforma è contestata.

## 6.4 Eventi e presidio territoriale

| Attività | Quando | Costo | Obiettivo |
|---|---|---|---|
| Visite ai poligoni della provincia pilota | Mesi 1-6, continuativo | Benzina | Censimento + relazione |
| Presenza a gare locali | Mesi 4+, weekend | Basso | Contatto diretto con tiratori e dirigenti |
| Giornate "porte aperte" con un poligono partner | Mese 9+ | 200-400 € | Acquisizione B2C + caso concreto |
| EOS Show / HIT Show come visitatore | Anno 1 | ~200 € | Mappare i concorrenti e i decisori |
| Stand a fiera di settore | Anno 2 | 2.000-3.000 € | Acquisizione B2B in volume |

---

# SEZIONE 7: PIANO DI PARTNERSHIP

## 7.1 Mappa delle partnership

| Partner | Priorità | Cosa dà a noi | Cosa diamo a loro | Quando |
|---|---|---|---|---|
| **Gestionali incumbent** (GESTIT, T.A.R.G.E.T., ArMa) | **1** | Accesso alla base installata, integrazione dati, neutralizzazione del concorrente più pericoloso | Un canale di domanda che loro non hanno e non vogliono costruire; revenue share sui clienti segnalati | Mesi 6-12 |
| **Poligoni privati / ASD** | **1** | Early adopter veloci, feedback, prime transazioni | Clienti nuovi, visibilità nazionale, strumenti gratuiti | Mesi 1-6 |
| **Comitati regionali UITS** | **2** | Legittimazione locale, accesso alle sezioni | Strumento di promozione della pratica, dati aggregati sulla frequentazione | Mesi 6-12 |
| **UITS nazionale** (post-riforma) | **2** | Potenziale sblocco di massa; con la centralizzazione, l'interlocutore decisivo | Digitalizzazione dell'accesso agli impianti che il DL 108 le assegna | Mesi 12-24 |
| **FITDS / FIDASC / FITAV** | **3** | Accesso a nicchie tesserate e a calendari gare | Visibilità degli impianti affiliati, strumento per i tesserati | Anno 2 |
| **Stampa di settore** (Armi e Tiro, Armi Magazine, GUNSweek) | **2** | Credibilità e raggiungimento del pubblico esatto | Contenuti, dati inediti dal censimento | Mesi 6+ |
| **Aziende del settore** (armi, ottiche, munizioni, abbigliamento) | **4** | Ricavi pubblicitari, co-marketing | Accesso a un pubblico qualificato e profilato | Anno 2-3 |
| **Istituti di vigilanza privata** | **2** | **Decine di GPG per istituto**, con obbligo di legge di 3 esercitazioni annuali (§3.5.5): utenti ricorrenti a domanda anelastica, acquisiti in blocco | Gestione digitale degli adempimenti di tutto il personale, con prova documentale delle esercitazioni | Mesi 15-18 |
| **Assicurazioni sportive** | **3** | Ricavo da intermediazione, valore aggiunto per l'utente | Canale distributivo verso una nicchia difficile da raggiungere | Anno 2 |
| **Stripe / provider cloud** | **5** | Condizioni agevolate, programmi startup | — | Continuativo |

## 7.2 La partnership che conta più delle altre

**I gestionali incumbent sono contemporaneamente la minaccia maggiore e il partner migliore.**

GESTIT è installato presso decine di sezioni, tiene i registri obbligatori, ha la relazione fiduciaria col direttore. Se decidesse di aggiungere un layer di discovery nazionale partirebbe con un vantaggio enorme. Ma è improbabile che lo faccia: costruire un marketplace a due lati è un'attività completamente diversa dal vendere software gestionale, richiede acquisizione B2C, e nessuno di questi operatori mostra segni di volerlo fare.

La proposta, quindi:

> "Voi gestite registri e contabilità, cosa che noi non faremo mai. Noi portiamo prenotazioni, cosa che voi non fate. Integriamoci: i vostri clienti ricevono prenotazioni dentro il vostro sistema, senza doppio inserimento, e voi prendete una quota su ogni cliente che ci segnalate."

Vale la pena di aprire questa conversazione **prima** di avere volume — non per firmare subito, ma per capire se hanno intenzione di verticalizzare. È l'informazione competitiva più importante ottenibile in questa fase, e costa una telefonata.

## 7.3 Tempistiche di avvicinamento

| Trimestre | Azione |
|---|---|
| **T1** (mesi 1-3) | Poligoni privati della provincia pilota. Contatto informale coi gestionali incumbent per mappare le intenzioni |
| **T2** (mesi 4-6) | Prima sezione TSN partner. Contatto con la stampa di settore. Primo contatto formale con un comitato regionale UITS |
| **T3** (mesi 7-9) | Proposta di integrazione formale a un gestionale incumbent. Presentazione dei risultati pilota al comitato regionale |
| **T4** (mesi 10-12) | Federazioni di nicchia (FITDS). Prima ipotesi di contatto con UITS nazionale, a riforma assestata |
| **Anno 2** | UITS nazionale, aziende di settore, assicurazioni |

**Nota sul tempismo istituzionale**: contattare UITS nazionale prima che lo statuto sia adeguato (scadenza indicativa fine settembre 2026) è tempo perso — l'organizzazione è in riassetto e non ha interlocutori stabili. La finestra utile si apre da fine 2026.

---

# SEZIONE 8: PIANO FINANZIARIO

## 8.1 Premessa metodologica

Le revisioni Grok/DeepSeek indicano 252.000 € di costi in Anno 1 con un team di 6-7 persone. Quei numeri **non sono ricostruiti dal basso**: sono un benchmark generico da startup, e uno scenario in cui il progetto parte con un finanziamento che oggi non esiste. Un investitore esperto li smonta immediatamente.

Il piano seguente è **bottom-up sullo scenario reale**: fondatore unico, sviluppatore, capitale personale limitato, tempo vincolato da turni di lavoro. Ogni voce è una spesa che si può verificare a listino.

## 8.2 Costi Anno 1 — dettaglio bottom-up

| Voce | Importo | Nota |
|---|---|---|
| Dominio + hosting (VPS o PaaS gestito) | 600 € | 40-50 €/mese, sufficiente fino a migliaia di utenti |
| Apple Developer Program | 92 € | 99 $/anno |
| Google Play Developer | 23 € | 25 $ una tantum |
| Servizi cloud accessori (mappe, e-mail transazionali, storage) | 400 € | Tier gratuiti quasi sufficienti al volume Anno 1 |
| Strumenti (design, gestione, analytics) | 350 € | Prevalentemente piani gratuiti |
| Commercialista e adempimenti | 1.100 € | Regime forfettario |
| Consulenza legale: contratto gestori, privacy policy, DPA, informative | 2.200 € | **Voce non comprimibile**, vedi §12 e §14 |
| Assicurazione RC professionale | 600 € | Prudenziale in un settore vigilato |
| Marketing e materiali | 2.500 € | Da §6.2 |
| Trasferte onboarding e censimento | 1.200 € | Compreso in §6.2, qui esplicitato per chiarezza |
| Buffer imprevisti (15%) | 1.300 € | |
| **TOTALE ANNO 1** | **≈ 10.400 €** | |

Esclusi: compenso del fondatore (nessun prelievo in Anno 1) e costituzione societaria, rimandata al superamento dei trigger di §8.6. Fino ad allora è sufficiente la partita IVA; costituire una SRL prima della validazione significa pagare 1.500-3.000 € più costi ricorrenti per una struttura che potrebbe non servire.

## 8.3 Costi Anni 2 e 3

| Voce | Anno 2 | Anno 3 |
|---|---|---|
| Infrastruttura e servizi (incl. storage foto bersagli, §3.5) | 4.500 € | 13.000 € |
| BD/onboarding part-time (da mese 13) | 18.000 € | 32.000 € |
| Sviluppo esterno (freelance a progetto) | 12.000 € | 45.000 € |
| Compenso fondatore (parziale in A2, pieno in A3) | 0 € | 35.000 € |
| Marketing | 10.500 € | 40.000 € |
| Legale, contabile, compliance, DPO | 4.500 € | 9.000 € |
| Costituzione SRL e adempimenti societari | 2.500 € | 1.500 € |
| Buffer | 4.500 € | 17.000 € |
| **TOTALE** | **≈ 56.500 €** | **≈ 192.500 €** |

## 8.4 Previsioni di ricavo — tre scenari

Costruzione dello scenario base, riga per riga:

| | Anno 1 | Anno 2 | Anno 3 |
|---|---|---|---|
| Poligoni attivi (fine anno) | 15 | 60 | 150 |
| di cui su piano Pro | 0 | 24 (40%) | 75 (50%) |
| Utenti registrati | 1.500 | 12.000 | 40.000 |
| Prenotazioni nell'anno | 4.000 | 30.000 | 110.000 |
| GMV intermediato | 100 k€ | 750 k€ | 2.750 k€ |
| **Ricavi — transaction fee** | 2.250 € | 45.000 € | 165.000 € |
| **Ricavi — SaaS B2B** | 585 € | 12.960 € | 53.100 € |
| **Ricavi — Pass Pro** | 0 € | 10.500 € | 50.000 € |
| **Ricavi — Advertising** | 0 € | 5.000 € | 25.000 € |
| **TOTALE RICAVI (base)** | **≈ 2.800 €** | **≈ 73.500 €** | **≈ 293.000 €** |

Derivazioni: fee = prenotazioni monetizzate × 1,50 € (fee attiva da mese 8 in A1, quindi su 1.500 prenotazioni); SaaS A2 = 24 gestori × 45 € medi × 12 mesi; Pass Pro A2 = 12.000 × 3,5% × 24,99 €, A3 = 40.000 × 5% × 24,99 € (conversione rivista in §4.4 dopo l'introduzione del modulo diario).

| Scenario | Anno 1 | Anno 2 | Anno 3 | Ipotesi sottostante |
|---|---|---|---|---|
| **Pessimistico** | 1.000 € | 27.000 € | 100.000 € | Adozione gestori più lenta (8/25/70 poligoni), fee sul tiratore rifiutata e sostituita a metà A2, Pass Pro fermo al 2% |
| **Base** | 2.800 € | 73.500 € | 293.000 € | Tabella sopra |
| **Ottimistico** | 5.500 € | 140.000 € | 560.000 € | Accordo con un gestionale incumbent o con UITS che sblocca l'onboarding in blocco; accordo con istituti di vigilanza sul segmento GPG (§3.5.5) |

Lo scenario ottimistico **non è una versione più energica di quello base**: dipende da un singolo evento discreto (un accordo di distribuzione). È corretto separarlo, perché non si raggiunge lavorando di più, si raggiunge chiudendo una trattativa.

## 8.5 Break-even

Flussi derivati da §8.2-8.4:

| | Anno 1 | Anno 2 | Anno 3 |
|---|---|---|---|
| Ricavi | 2.800 € | 73.500 € | 293.000 € |
| Costi | 10.400 € | 56.500 € | 192.500 € |
| **Risultato d'esercizio** | **−7.600 €** | **+17.000 €** | **+100.500 €** |
| Cumulato | −7.600 € | +9.400 € | +109.900 € |

| Definizione | Momento | Cumulato negativo massimo |
|---|---|---|
| **Break-even di cassa** (ricavi > costi vivi, fondatore non retribuito) | **mese ~19** | ≈ −15.000 € |
| **Break-even economico** (fondatore retribuito a 35 k€/anno da Anno 1) | **mese ~31** | ≈ −61.000 € |

Il break-even di cassa cade dentro l'Anno 2 perché i costi di quell'anno sono anticipati (BD dal mese 13) mentre i ricavi maturano progressivamente: il picco negativo cumulato si colloca intorno al mese 16-18. Il break-even economico ricalcola gli Anni 1 e 2 imputando 35 k€/anno di compenso al fondatore, che nello scenario reale non viene prelevato.

La distinzione è mantenuta perché la prima cifra è quella che dice se il progetto sopravvive senza capitale esterno, la seconda è quella che dice se è un'azienda. Presentare solo la prima è la scorciatoia più comune nei business plan bootstrap ed è il primo punto su cui un investitore attento fa domande.

**Assunzioni che determinano il break-even**, in ordine di sensibilità:
1. Numero di poligoni attivi a fine Anno 2 (60). A 40 il break-even slitta di ~7 mesi;
2. Prenotazioni per poligono attivo per mese (~42 in A2). È il vero motore: dipende dal liquidity rate;
3. Tasso di conversione al piano Pro (40% in A2). A 25% il break-even di cassa slitta di ~4 mesi;
4. Tenuta della fee lato tiratore. Il passaggio al modello a commissione sul gestore riduce la penetrazione ma alza il ricavo unitario: impatto netto stimato ±15%.

## 8.6 Fabbisogno finanziario e trigger per il round

**Anno 1: nessun capitale esterno.** Fabbisogno ≈ 10.400 €, coperto da capitale personale. È il punto di forza principale di questo piano rispetto alle versioni proposte dalle revisioni: consente di validare l'ipotesi centrale senza diluizione e senza pressione da terzi.

**Un round pre-seed da 150-250 k€ ha senso solo dopo il superamento di tutti e quattro questi trigger:**

| # | Trigger | Perché |
|---|---|---|
| 1 | ≥25 poligoni attivi, di cui ≥8 paganti | Dimostra che il modello di ricavo funziona su gestori veri |
| 2 | Liquidity rate >20% stabile per 3 mesi | Dimostra che il prodotto converte, non solo che attira |
| 3 | Retention gestori >70% a 6 mesi senza incentivi | Dimostra valore reale, non cortesia iniziale |
| 4 | Playbook di onboarding eseguito con successo da persona diversa dal fondatore | Dimostra che il capitale può comprare crescita |

**Impiego dei fondi**: ~50% assunzioni commerciali (l'onboarding è il collo di bottiglia), ~25% sviluppo, ~15% marketing, ~10% riserva. **Non** sviluppo prodotto in maggioranza: il vincolo di questo business è la distribuzione, non il codice.

Prima del trigger 4, il capitale accelera l'apprendimento sbagliato: si acquisiscono gestori più in fretta di quanto si riesca a servirli, e il churn si mangia il vantaggio.

---

# SEZIONE 9: METRICHE E KPI

## 9.1 La metrica principale

**Liquidity rate** = ricerche che si concludono in una prenotazione (o in una richiesta di disponibilità) / ricerche totali.

È la metrica singola più informativa per un marketplace a due lati, e discrimina il tipo di problema:

| Liquidity rate | Diagnosi | Azione |
|---|---|---|
| < 10% | **Problema di copertura**: l'utente non trova nulla di rilevante | Più poligoni, dati più aggiornati. Non spendere in marketing |
| 10-20% | Problema di conversione: trova ma non prenota | Migliorare scheda, prezzi, attrito del checkout |
| > 20% | Problema di domanda: converte bene, serve traffico | **Solo ora** ha senso investire in acquisizione |

L'errore che questa metrica previene è il più costoso e il più frequente: spendere in acquisizione quando il problema è la copertura dell'offerta.

## 9.2 Tabella KPI con target

| KPI | Tipo | Anno 1 | Anno 2 | Anno 3 | Frequenza |
|---|---|---|---|---|---|
| **Liquidity rate** | Leading | >15% | >22% | >28% | Settimanale |
| Poligoni censiti (dati completi) | Leading | 120 | 300 | 400 | Mensile |
| Poligoni attivi (≥1 prenotazione/mese) | Lagging | 15 | 60 | 150 | Settimanale |
| % poligoni con dati aggiornati <30 gg | **Leading** | >80% | >85% | >90% | Settimanale |
| **Ore fondatore per onboarding** | **Leading** | <6 h | <3 h | <1,5 h | Per evento |
| Utenti registrati | Lagging | 1.500 | 12.000 | 40.000 | Mensile |
| Utenti attivi mensili | Lagging | 400 | 3.500 | 13.000 | Mensile |
| Prenotazioni/anno | Lagging | 4.000 | 30.000 | 110.000 | Settimanale |
| Prenotazioni per poligono attivo/mese | **Leading** | 22 | 42 | 61 | Mensile |
| GMV | Lagging | 100 k€ | 750 k€ | 2,75 M€ | Mensile |
| MRR (solo SaaS B2B, a fine anno) | Lagging | 195 € | 1.080 € | 4.425 € | Mensile |
| Ricavo medio mensile (tutti i canali) | Lagging | 235 € | 6.125 € | 24.400 € | Mensile |
| **% utenti attivi che registrano una sessione** | **Leading** | — | >35% | >45% | Mensile |
| **% sessioni auto-generate da prenotazione** | Leading | — | >60% | >70% | Mensile |
| Utenti con contatore munizioni attivo | Leading | — | >25% | >35% | Mensile |
| Bersagli caricati per utente attivo/mese | Leading | — | >0,8 | >1,2 | Mensile |
| Conversione a Pass Pro | Lagging | — | 3,5% | 5% | Mensile |
| Utenti GPG con libretto attivo | Leading | — | 300 | 1.500 | Trimestrale |
| Churn gestori | Lagging | <8%/mese | <5%/mese | <3%/mese | Mensile |
| % gestori che rinnovano a 6 mesi senza incentivo | **Leading** | >60% | >70% | >80% | Trimestrale |
| Retention utenti a 90 giorni | Leading | >25% | >35% | >45% | Mensile |
| CAC gestore (monetario) | — | <100 € | <200 € | <350 € | Trimestrale |
| CAC utente | — | <2 € | <2,5 € | <3 € | Trimestrale |
| Time-to-booking | Leading | <4 min | <3 min | <2 min | Continuo |
| NPS gestori | Leading | >30 | >45 | >50 | Semestrale |
| NPS tiratori | Leading | >25 | >40 | >50 | Trimestrale |

## 9.3 Leading vs lagging

Un piano bootstrap non può permettersi di scoprire i problemi in ritardo: non ha capitale per assorbirli. Le tre metriche di allerta precoce, in ordine:

1. **% poligoni con dati aggiornati <30 giorni.** Cala prima di qualsiasi altra cosa e anticipa il crollo del liquidity rate. Se il dato invecchia, l'utente trova informazioni sbagliate, si presenta a un poligono chiuso e non torna. **È la metrica di sopravvivenza del prodotto.**
2. **Ore per onboarding.** Se non scende, il progetto non scala: ogni nuovo poligono costa quanto il precedente e il fondatore diventa il tetto della crescita.
3. **Prenotazioni per poligono attivo.** Se è sotto 15/mese, il gestore non percepisce valore e churn-erà entro 3-4 mesi, indipendentemente da quanto sia soddisfatto oggi.

## 9.4 Dashboard di monitoraggio

**Settimanale** (15 minuti): liquidity rate, prenotazioni, nuovi poligoni attivi, % dati aggiornati, segnalazioni di errore dati.

**Mensile** (1 ora): MRR, churn gestori, retention utenti, prenotazioni per poligono, ore di onboarding, cassa e runway.

**Trimestrale** (mezza giornata): NPS, CAC/LTV, verifica dei trigger di §4.2 e §8.6, revisione delle assunzioni critiche.

In Anno 1 la dashboard è un foglio di calcolo. Costruire strumenti di analytics prima di avere dati da analizzare è una forma elegante di procrastinazione.

---

# SEZIONE 10: TEAM E COMPETENZE

## 10.1 La situazione di partenza, dichiarata

Il business plan v1.0 non nomina il team. È la lacuna che un investitore nota prima di ogni altra: nella maggior parte delle decisioni di investimento early-stage il team pesa più del mercato.

**Configurazione attuale**: fondatore unico, con competenze di sviluppo software, impegnato in un lavoro a turni ciclici che vincola il tempo disponibile ma garantisce reddito e giornate infrasettimanali libere.

Va detto con franchezza, perché è un profilo con vantaggi reali e limiti reali:

| Vantaggi | Limiti |
|---|---|
| Può costruire il prodotto senza costi di sviluppo | Nessuna esperienza commerciale B2B dichiarata |
| Reddito indipendente → nessuna pressione a monetizzare male | Tempo frammentato: impossibile garantire reattività in orario d'ufficio |
| I turni liberano giorni infrasettimanali, quando i poligoni e le sezioni sono raggiungibili | Rischio di essere il collo di bottiglia su ogni funzione |
| Nessun burn rate → runway illimitato | Nessuna rete pregressa nel settore (da verificare) |

Il vantaggio più sottovalutato è il terzo: la maggior parte delle sezioni TSN ha segreteria aperta in orari infrasettimanali ristretti, gli stessi in cui una persona con lavoro d'ufficio non è disponibile. È un vantaggio competitivo concreto sull'attività di onboarding, e va sfruttato deliberatamente.

## 10.2 Ruoli per fase

| Fase | Chi serve | Forma | Costo |
|---|---|---|---|
| **Pre-MVP** (mesi 1-6) | Fondatore: censimento, interviste, vendita, prodotto | — | 0 € |
| | Consulente legale (contratti, privacy) | Una tantum | 2.200 € |
| **MVP** (mesi 7-12) | Fondatore: sviluppo e onboarding | — | 0 € |
| | Designer UI | A progetto, 5-8 giornate | 2.000-3.000 € (A2) |
| **Scala** (mesi 13-24) | **BD / Onboarding manager part-time** | Collaborazione, 20h/sett | 18.000 €/anno |
| | Sviluppatore freelance | A progetto | 12.000 €/anno |
| | Supporto clienti part-time | Da mese 20 | in A3 |
| **Anno 3** | Fondatore full-time retribuito | — | 35.000 € |
| | BD full-time | — | 32.000 € |
| | Sviluppatore | Freelance o assunto | 45.000 € |

## 10.3 Il primo assunto: BD, non sviluppatore

Confermo la posizione della revisione Claude contro quella di Grok/DeepSeek (che indicavano Product Manager e due sviluppatori full-stack come priorità alta), e aggiungo la ragione quantitativa che nessuna revisione fornisce.

Con 4-8 ore di fondatore per onboarding (§4.4) e 6 giorni liberi al mese realisticamente dedicabili, il tetto strutturale è **6-10 nuovi poligoni al mese**, e solo se il fondatore non facesse altro. Ma deve anche sviluppare, aggiornare i dati, fare supporto. Il tetto reale è **2-3 poligoni al mese**.

A quel ritmo, l'obiettivo di 60 poligoni a fine Anno 2 è irraggiungibile. Un secondo sviluppatore non sposta questo vincolo di un millimetro: **il collo di bottiglia è la distribuzione, non il codice**. Un BD part-time a 18.000 €/anno che porta l'onboarding a 8-12 poligoni al mese è l'unico investimento che cambia la traiettoria del piano.

## 10.4 Cosa esternalizzare e cosa mai

| Attività | Decisione | Motivo |
|---|---|---|
| Sviluppo app e backend | **Interno** | È la competenza del fondatore. Esternalizzarla significa pagare per la propria forza |
| Design UI | **Esterno** | Non è la competenza del fondatore; un'interfaccia amatoriale costa credibilità B2B |
| Consulenza legale e privacy | **Esterno, sempre** | §14. Non è un'area in cui improvvisare, in un settore vigilato |
| Contabilità | **Esterno** | Costo basso, rischio alto |
| Onboarding e relazione coi gestori | **Interno finché possibile** | È la fonte principale di apprendimento sul prodotto. Delegarlo troppo presto significa perdere il contatto col mercato |
| Supporto clienti | Interno → esterno da Anno 3 | — |
| Contenuti SEO | Interno → esterno da Anno 2 | Serve competenza di settore, difficile da trovare fuori |

## 10.5 Il rischio chiave del team

**Un fondatore unico è il rischio più grave dell'intero piano**, più della concorrenza e più della normativa. Non c'è nessuno che copra le competenze commerciali, nessuno con cui discutere le decisioni, nessuna continuità in caso di indisponibilità.

Mitigazioni, in ordine di efficacia:
1. **Cercare un co-fondatore commerciale** con radici nel settore (dirigente di sezione, istruttore, giornalista di settore). Vale più di qualsiasi assunzione e più di molto capitale;
2. **Advisor informali** — un direttore di poligono e un consulente legale del settore, compensati in equity o gratuitamente in cambio di accesso anticipato;
3. **Documentare il playbook** dal primo giorno, così che l'onboarding sia trasferibile (è il trigger 4 di §8.6);
4. **Ritmo sostenibile.** Un piano bootstrap fallisce molto più spesso per esaurimento del fondatore che per esaurimento della cassa. La roadmap di §11 è deliberatamente dimensionata su un impegno part-time, non sull'ipotesi che il fondatore lavori tutte le sere.

---

# SEZIONE 11: ROADMAP OPERATIVA A 18 MESI

## 11.1 Principio: validare prima di costruire

Il documento v1.0 prevedeva sviluppo MVP ai mesi 3-5. Questo piano lo sposta più avanti e antepone tre mesi di lavoro **senza codice**. La ragione è specifica di questo business: l'asset difendibile è il **dato**, non l'app (§3.1). Il dato si raccoglie a mano, camminando. E se il censimento a mano si rivela impossibile o inutile, si è risparmiato un anno di sviluppo.

## 11.2 Roadmap trimestrale

### T1 — Mesi 1-3: Censimento e validazione manuale

| Milestone | Deliverable | Criterio di successo |
|---|---|---|
| Selezione area pilota | Short-list di 3 province con punteggio (§5.3) | Provincia scelta entro settimana 2 |
| Censimento | Google Sheet con tutte le strutture della provincia: contatti, orari, listini, discipline, calibri, presenza booking | ≥40 strutture censite, ≥25 con dati completi |
| Interviste gestori | 15 conversazioni, di persona dove possibile | ≥10 completate; pain point ricorrenti identificati |
| Interviste tiratori | 20 conversazioni nelle community locali | Willingness-to-pay sulla fee testata su ≥15 persone |
| Concierge manuale | Numero WhatsApp Business attivo, prenotazioni gestite a mano | **≥10 prenotazioni reali concluse** |
| Legale | Bozza contratto gestori + informativa privacy | Documenti pronti alla firma |

**Costo T1: ≈ 2.800 €. Codice scritto: zero.**

**Criterio di uscita (gate).** Se dopo 3 mesi non si sono concluse 10 prenotazioni reali gestite a mano, **fermarsi e capire perché** prima di scrivere una riga di codice. È il punto di controllo più importante del piano.

### T2 — Mesi 4-6: Vetrina pubblica

| Milestone | Deliverable | Criterio di successo |
|---|---|---|
| Sito/PWA pubblica | Ricerca, mappa, schede complete, "richiedi disponibilità" | Online entro mese 5 |
| Migrazione censimento | Dati del foglio nel database | 100% delle strutture pubblicate |
| SEO di base | Pagina indicizzabile per struttura, contenuti di servizio | ≥3 pagine in prima pagina su query locali entro mese 6 |
| Auto-gestione gestori | Area riservata per aggiornare orari e listino | ≥3 gestori che aggiornano da soli |
| Primi partner formali | Contratto firmato | ≥5 poligoni partner |

**Criterio di uscita.** Traffico organico misurabile e almeno 20 richieste di disponibilità inoltrate.

### T3 — Mesi 7-9: Prenotazione reale

| Milestone | Deliverable | Criterio di successo |
|---|---|---|
| Motore di prenotazione | Slot, disponibilità, conferme, promemoria | Attivo su ≥5 poligoni |
| Planner gestore | Gestione linee, blocco slot, prenotazioni in arrivo | Usato quotidianamente da ≥3 gestori |
| Gestione doppio binario | Inserimento manuale delle prenotazioni telefoniche + regole contrattuali | Zero doppie prenotazioni in 60 giorni |
| App mobile o PWA installabile | — | ≥300 installazioni |
| Misurazione | Liquidity rate strumentato | **>15%** |

**Criterio di uscita.** 50 prenotazioni/settimana e liquidity rate >15% → sblocca il trigger fee di §4.2.

### T4 — Mesi 10-12: Monetizzazione

| Milestone | Deliverable | Criterio di successo |
|---|---|---|
| Pagamenti | Stripe, prepagamento, rimborsi, fee esposta in chiaro | Flusso end-to-end funzionante |
| Test fee | Fee attiva su 5 poligoni | **Abbandono al checkout <25%** — se superiore, attivare il piano B di §4.5 |
| Densità | Estensione alla provincia contigua | 15 poligoni attivi |
| Locker documentale | Con i limiti di responsabilità di §14 | Rilasciato con disclaimer contrattuale firmato da tutti i partner |
| **"Il Mio Tiro" v1** | Diario auto-generato dalla prenotazione, contatore colpi, **contatore munizioni con soglie art. 97 TULPS**, costo per sessione | ≥35% degli utenti attivi registra almeno una sessione |
| Bilancio Anno 1 | Verifica di tutti i KPI e delle assunzioni critiche | Decisione documentata: continuare / correggere / fermarsi |

### T5 — Mesi 13-15: Scala assistita

| Milestone | Deliverable | Criterio di successo |
|---|---|---|
| Primo BD part-time | Assunzione e formazione | Onboarding autonomo di ≥5 poligoni |
| Playbook | Procedura di onboarding documentata | Eseguita con successo da persona diversa dal fondatore |
| Espansione regionale | — | 30 poligoni attivi |
| Integrazione gestionali | Export CSV/iCal, prima trattativa formale | ≥1 integrazione funzionante |
| SaaS Pro | Lancio con early adopter a 39 € bloccati | ≥8 gestori paganti |
| **"Il Mio Tiro" v2** | Foto bersaglio con marcatura manuale e statistiche del gruppo, manutenzione per colpi, esportazione | ≥0,8 bersagli caricati per utente attivo/mese |
| **Libretto GPG + canale istituti di vigilanza** | Libretto digitale con scadenze quadrimestrali; contatto con 5 istituti | ≥1 accordo con istituto, ≥300 GPG registrate |
| Pass Pro | Lancio abbonamento con il modulo diario come contenuto | Conversione ≥3% |

### T6 — Mesi 16-18: Replicabilità

| Milestone | Deliverable | Criterio di successo |
|---|---|---|
| Seconda regione non contigua | Applicazione del playbook dove il fondatore non ha relazioni | ≥10 poligoni in 3 mesi |
| Spotter | Sistema di segnalazione con anti-abuso e soglie di fiducia | ≥80% dei dati aggiornati <30 gg |
| Partnership istituzionale | Accordo con comitato regionale UITS o federazione | ≥1 accordo firmato |
| Preparazione round | Data room, metriche, verifica trigger §8.6 | Tutti e 4 i trigger soddisfatti |
| **Traguardo 18 mesi** | | **45 poligoni attivi, 15 paganti a 39 € early adopter, MRR ≥600 €** |

## 11.3 Prioritizzazione RICE delle funzionalità

Punteggio = (Reach × Impact × Confidence) / Effort. Reach = utenti toccati per trimestre; Impact 0,25-3; Confidence 0-100%; Effort in settimane-uomo.

| Funzionalità | Reach | Impact | Conf. | Effort | **RICE** | Fase |
|---|---|---|---|---|---|---|
| Scheda struttura completa (orari, listino, calibri) | 1.500 | 3,0 | 100% | 2 | **2.250** | MVP |
| Ricerca geolocalizzata + mappa | 1.500 | 3,0 | 100% | 3 | **1.500** | MVP |
| Filtri tecnici | 1.200 | 2,0 | 90% | 2 | **1.080** | MVP |
| "Richiedi disponibilità" (senza booking) | 900 | 2,0 | 95% | 1 | **1.710** | MVP |
| Auto-gestione dati dal gestore | 40 | 3,0 | 90% | 2 | **54** | MVP |
| SEO: pagina per struttura | 3.000 | 2,0 | 70% | 2 | **2.100** | MVP |
| Motore di prenotazione | 800 | 3,0 | 80% | 8 | **240** | T3 |
| Planner linee gestore | 30 | 3,0 | 85% | 6 | **13** | T3 |
| **Export verso gestionale esistente** | 25 | 3,0 | 90% | 2 | **34** | T5 |
| Pagamenti e fee | 600 | 2,0 | 70% | 5 | **168** | T4 |
| Check-in QR | 500 | 1,5 | 70% | 4 | **131** | T4 |
| Locker documentale | 700 | 2,0 | 60% | 6 | **140** | T4 |
| **Contatore munizioni con soglie art. 97 TULPS** | 900 | 2,5 | 85% | 3 | **638** | T4 |
| **Diario sessioni auto-generato dalla prenotazione** | 800 | 2,0 | 90% | 3 | **480** | T4 |
| Contatore colpi e costo per sessione | 800 | 1,5 | 85% | 2 | **510** | T4 |
| **Foto bersaglio + marcatura manuale + statistiche gruppo** | 600 | 2,0 | 80% | 4 | **240** | T5 |
| **Libretto di tiro GPG con scadenze quadrimestrali** | 250 | 3,0 | 85% | 3 | **213** | T5 |
| Manutenzione arma per numero di colpi | 400 | 1,0 | 75% | 1 | **300** | T5 |
| Esportazione diario PDF/CSV | 300 | 1,0 | 90% | 1 | **270** | T5 |
| **Rilevamento automatico dei fori (CV)** | 600 | 1,0 | 45% | 10 | **27** | T6+, condizionato |
| Spotter con anti-abuso | 300 | 1,5 | 50% | 5 | **45** | T6 |
| Gamification e badge | 300 | 0,5 | 40% | 4 | **15** | Anno 2+ |
| Recensioni e community | 400 | 0,5 | 40% | 6 | **13** | Anno 2+ |
| Push geolocalizzate | 600 | 1,0 | 60% | 3 | **120** | Anno 2 |

Il punteggio conferma quantitativamente ciò che §3.2 argomentava: **le funzionalità informative valgono un ordine di grandezza più di quelle transazionali**, perché raggiungono tutti gli utenti su tutte le strutture, mentre la prenotazione raggiunge alcuni utenti su poche strutture. Il RICE basso di planner ed export riflette il Reach piccolo (30 gestori), non la loro importanza: sono funzionalità di retention B2B, dove il valore non si misura in Reach. **Il RICE va usato per ordinare, non per decidere.**

Sul modulo "Il Mio Tiro" il calcolo dice due cose nette. Il **contatore munizioni** ottiene il punteggio più alto di tutte le funzionalità post-MVP (638): tocca quasi tutti gli utenti, ha impatto elevato perché risolve un problema con conseguenze legali, e costa tre settimane. Il **rilevamento automatico dei fori** ottiene 27, il punteggio più basso dell'intera tabella dopo la gamification: dieci settimane di sforzo, confidenza bassa e nessuna differenziazione rispetto a TargetScan (§3.5.7). Il rapporto tra i due è di **24 a 1**, e la funzionalità con il punteggio più alto è quella che nessun concorrente offre — mentre quella con il punteggio più basso è quella che tre concorrenti offrono già.

## 11.4 Dipendenze critiche

| Dipendenza | Blocca | Rischio | Mitigazione |
|---|---|---|---|
| Contratto e informativa privacy | Qualsiasi partner formale | Alto: senza, non si può firmare né trattare dati | Da avviare nella settimana 1, non al mese 5 |
| Almeno 5 gestori disposti al prepagamento | Attivazione fee (T4) | Alto | Testato già nelle interviste T1, non scoperto al mese 10 |
| Approvazione App Store | Pubblicazione app nativa | Medio | PWA come percorso primario; nativa solo dopo trazione (§12) |
| Assetto UITS post-riforma | Partnership istituzionali | Medio | Nessuna dipendenza prima del mese 12 |
| Disponibilità di tempo del fondatore | Tutto | **Alto** | Roadmap dimensionata su ~15 h/settimana; il BD anticipa il vincolo |

---

# SEZIONE 12: ANALISI SWOT E MATRICE DEI RISCHI

## 12.1 SWOT

### Punti di forza

| | Sostanza |
|---|---|
| **Architettura a due lati corretta** | Aggredisce simultaneamente il gap informativo B2C e quello di riempimento B2B; è la struttura giusta per il problema |
| **Verticalità normativa** | Calibri, discipline, documenti, DIMA: conoscenza di dominio che un operatore orizzontale non replica in fretta |
| **Complementarità agli incumbent** | Non chiede al gestore di sostituire nulla: è il posizionamento a minor attrito disponibile |
| **Costo di struttura quasi nullo** | ~10 k€ nel primo anno: il progetto può sbagliare più volte senza morire — un vantaggio raro |
| **Fondatore sviluppatore** | Ciclo di iterazione sul prodotto senza costi né intermediari |
| **Disponibilità infrasettimanale** | Coincide con gli orari in cui sezioni e segreterie sono realmente raggiungibili |
| **Compliance-first** | L'esclusione esplicita di ogni intermediazione su armi e munizioni è una scelta corretta e non scontata |

### Punti di debolezza

| | Sostanza |
|---|---|
| **Fondatore unico** | Nessuna copertura commerciale, nessun contraddittorio, nessuna continuità. Rischio n.1 (§10.5) |
| **Tempo frammentato** | Incompatibile con reattività in orario d'ufficio e con cicli di vendita che richiedono presenza |
| **Nessuna trazione né validazione** | Ad oggi zero utenti, zero gestori, zero prenotazioni. Ogni numero del piano è un'ipotesi |
| **Nessuna rete pregressa nel settore** (da confermare) | In un mercato relazionale è uno svantaggio di partenza pesante |
| **Nessun capitale per accelerare** | Se emergesse un concorrente veloce, non ci sarebbe modo di rispondere in velocità |
| **Modulo B2B non competitivo come gestionale** | Riconosciuto e affrontato con il riposizionamento di §2.5.2, ma resta un limite funzionale |

### Opportunità

| | Sostanza |
|---|---|
| **Riforma UITS (DL 108/2026)** | Finestra di riorganizzazione, interlocutore nazionale unico, apertura ai poligoni privati. Occasione irripetibile di tempismo |
| **Crescita strutturale delle licenze** | +7,9% e +6,3% nel 2025: il bacino cresce senza sforzo di evangelizzazione |
| **Quadrante competitivo vuoto** | Nessun operatore verticale nazionale (§2.5.3) |
| **Dato proprietario** | Il censimento aggiornato delle strutture italiane non esiste: chi lo costruisce ha un asset unico |
| **Domanda anelastica da obbligo** | DIMA e adempimenti generano frequentazione prevedibile e non contendibile |
| **Segmento neofita non servito** | Il profilo di maggior valore è quello che nessun canale attuale raggiunge |
| **Vuoto normativo negli strumenti digitali** | Nessuna app gestisce i limiti dell'art. 97 TULPS né il libretto di tiro GPG: i concorrenti sono tutti esteri e non hanno ragione di conoscerli (§3.5.3) |
| **Segmento GPG a domanda obbligata** | 44.347 licenze in crescita, 3 esercitazioni annue per legge, canale B2B via istituti di vigilanza |

### Minacce

| | Sostanza |
|---|---|
| **Resistenza digitale dei gestori** | *Riclassificata da Debolezza a Minaccia*: non è un difetto del progetto, è una caratteristica del mercato che qualsiasi operatore incontrerebbe. La distinzione conta: si affronta con il modello di ingaggio, non con più esecuzione |
| **Verticalizzazione di un incumbent** | GESTIT o simili aggiungono la discovery partendo dalla base installata. È la minaccia competitiva più concreta, molto più di Anolla |
| **Deriva della riforma UITS** | Se la gestione centralizzata degli impianti sfociasse in una piattaforma pubblica di prenotazione, il mercato si chiuderebbe |
| **Policy degli app store** | Un'app legata a strutture con armi da fuoco è categoria sensibile a prescindere dall'assenza di vendita |
| **Responsabilità legale sul check-in documentale** | Un incidente con un tiratore ammesso su verifica digitale è un rischio esistenziale |
| **Concorrente locale gratuito** | Una sezione che apre il proprio booking annulla il valore incrementale in quella zona |
| **App di diario già mature** | MyGuns, TargetScan, Shotlog e MantisX presidiano il modulo §3.5 da anni. Il vantaggio è nella sessione auto-generata e nel diritto italiano, non nelle funzionalità in sé |
| **Sensibilità reputazionale del settore** | Un fatto di cronaca può cambiare il clima normativo e mediatico in settimane |

## 12.2 Matrice dei rischi

Scala: probabilità e impatto da 1 (basso) a 5 (alto). Priorità = P × I.

| # | Rischio | P | I | **Pri.** | Livello | Mitigazione | Metrica di controllo | **Contingenza** |
|---|---|---|---|---|---|---|---|---|
| 1 | **Resistenza digitale dei gestori** | 5 | 5 | **25** | ALTO | Piano Free senza limiti; nessun cambio di sistema richiesto; onboarding 1:1 di persona; export verso gestionale esistente | % di poligoni contattati che attivano la scheda | Se <30% dopo 3 mesi: passare dall'outreach diretto al canale istituzionale (comitati UITS) o alla partnership con un gestionale |
| 2 | **Responsabilità legale su verifica documenti** | 3 | 5 | **15** | ALTO | Il locker è **supporto**, mai sostituto, del controllo fisico all'ingresso; disclaimer contrattuale esplicito con ogni partner; nessuna asserzione di validità dei documenti | Presenza del disclaimer firmato su 100% dei contratti | Consulenza legale e assicurativa **prima** del primo onboarding, non dopo il primo incidente. Se il rischio è ritenuto non assicurabile: rilasciare il locker come archivio personale dell'utente senza alcuna funzione di verifica |
| 2-bis | **Violazione dei dati su armi e munizioni detenute** | 2 | 5 | **10** | ALTO per gravità | **Non archiviare matricole né documenti di detenzione** nella v1 (§3.5.8); solo tipo e calibro. Se in futuro servisse l'inventario completo: cifratura zero-knowledge lato client. Mai usare i dati di detenzione per targeting | Presenza di identificativi univoci nel database (target: zero) | Un archivio violato di chi possiede armi e dove abita è un elenco operativo per un furto. **Nessuna contingenza è accettabile: il rischio va evitato a monte, non gestito a valle** |
| 3 | **Il fondatore è il collo di bottiglia** | 5 | 3 | **15** | ALTO | Roadmap dimensionata su 15 h/settimana; playbook dal giorno 1; BD part-time al mese 13 | Ore per onboarding; poligoni aggiunti/mese | Se le ore non scendono sotto 6 entro il mese 12: anticipare il BD anche a costo di ridurre lo sviluppo |
| 4 | **Verticalizzazione di un incumbent** | 3 | 4 | **12** | MEDIO-ALTO | Aprire il dialogo di partnership presto; accumulare dati proprietari e relazioni; velocità sul lato B2C dove loro sono deboli | Monitoraggio trimestrale di siti e comunicazioni dei concorrenti | Se un incumbent annuncia un layer di discovery: valutare integrazione o cessione della componente dati anziché competizione frontale |
| 5 | **Dati obsoleti / poligoni fantasma** | 4 | 4 | **16** | ALTO | Verifica manuale periodica nei primi 12 mesi; Spotter solo dopo massa critica; segnalazione errori in ogni scheda | **% dati aggiornati <30 gg (>80%)** | Se scende sotto 70%: sospendere l'espansione geografica e ripulire prima di crescere. Una piattaforma con dati sbagliati è peggio di nessuna piattaforma |
| 6 | **Doppio binario online/telefono** | 4 | 3 | **12** | MEDIO-ALTO | Il gestore si impegna contrattualmente a inserire anche le prenotazioni telefoniche; slot cuscinetto nella fase di transizione | Doppie prenotazioni per mese (target: 0) | Responsabilità contrattuale in capo al gestore, scritta nei termini. Alla seconda doppia prenotazione: sospensione della prenotazione istantanea per quella struttura e passaggio a conferma manuale |
| 7 | **Fee rifiutata dal tiratore** | 3 | 3 | **9** | MEDIO | Test nelle interviste T1; fee esposta in chiaro; A/B test in T4 | Abbandono al checkout <25% | Piano B già definito: commissione sul gestore (§4.5) |
| 8 | **Policy App Store** | 3 | 3 | **9** | MEDIO | Posizionamento "Sport Utility & Location Finder"; nessun riferimento a compravendita; **PWA come percorso primario** | Esito della submission | Se rifiutata: PWA installabile, che copre il 90% dei casi d'uso. Il piano non dipende dalla pubblicazione sugli store — una differenza sostanziale rispetto alla v1.0 |
| 9 | **Deriva centralizzatrice della riforma UITS** | 2 | 5 | **10** | MEDIO | Monitoraggio attivo dello statuto; costruzione precoce di rapporti coi comitati regionali; presidio del segmento privato | Adeguamento statutario (entro fine settembre 2026) e regolamenti attuativi | Se UITS sviluppasse una propria piattaforma: riposizionarsi sui poligoni privati e sulle federazioni non UITS, dove la riforma non arriva |
| 10 | **Bassa frequenza di prenotazione** | 3 | 3 | **9** | MEDIO | Focus sui segmenti a maggior frequenza (§2.3); notifiche stagionali (apertura caccia, campionati) | Prenotazioni per utente attivo >2/anno | Spostare il peso del modello dal volume di transazioni al SaaS B2B |
| 11 | **Concorrente locale gratuito** | 3 | 2 | **6** | BASSO-MEDIO | Il valore è la trasversalità, non la singola struttura | Quota di strutture con booking proprio nell'area | Integrare invece di competere: il booking proprio del poligono resta, noi portiamo la domanda |
| 12 | **Evento reputazionale di settore** | 2 | 4 | **8** | MEDIO | Posizionamento sportivo rigoroso; nessuna estetica militare; nessuna intermediazione su armi | Monitoraggio del clima normativo | Piano di comunicazione pronto; sospensione temporanea delle campagne |
| 13 | **Scalabilità tecnica** | 1 | 2 | **2** | BASSO | Architettura semplice, monolite modulare | Uptime, latenza | Nessuna: ai volumi previsti (§8.4) non è un problema reale prima dell'Anno 3. **Sovradimensionare l'architettura è esso stesso un rischio** per un fondatore unico |

**Nota sul rischio 13.** Le revisioni Grok/DeepSeek indicavano microservizi, load testing e disaster recovery come mitigazione. A 110.000 prenotazioni all'anno — circa 12 all'ora di picco — un'architettura a microservizi è una complessità che consuma il tempo del fondatore senza risolvere alcun problema esistente. È un rischio inventato la cui mitigazione ne crea uno vero.

## 12.3 Piano di contingenza per i tre rischi critici

**Rischio 1 — Resistenza dei gestori.** Punto di controllo: mese 3. Se meno di 10 poligoni sui 40 contattati hanno attivato la scheda, l'ipotesi di canale è sbagliata, non l'esecuzione. Non insistere: passare al canale istituzionale (comitati regionali UITS) o alla partnership con un gestionale incumbent, che porta la relazione già costruita. Se anche questi falliscono entro il mese 6, l'ipotesi di fondo — che i gestori vogliano più clienti — è falsa, e il progetto va ripensato come strumento puramente B2C (directory e informazione, monetizzata via SEO e pubblicità), che è un business più piccolo ma reale.

**Rischio 2 — Responsabilità legale.** Non ammette contingenza reattiva. Il locker documentale **non viene rilasciato** finché non esistono: parere legale scritto, clausola contrattuale firmata da ogni partner, copertura assicurativa verificata. Se una di queste tre condizioni manca, la funzionalità resta un archivio personale dell'utente senza alcuna funzione di verifica per il gestore. È l'unica funzionalità del piano soggetta a un veto assoluto.

**Rischio 5 — Dati obsoleti.** Punto di controllo settimanale. Sotto il 70% di dati aggiornati a 30 giorni scatta il congelamento dell'espansione: nessun nuovo poligono, nessuna nuova area, finché la qualità non risale sopra l'80%. Un utente che si presenta a un poligono chiuso non torna e lo racconta nella sua community. In un mercato di nicchia con community connesse, la reputazione si brucia una volta sola.

---

# SEZIONE 13: STRATEGIA DI RETENTION

## 13.1 Retention B2B (gestori)

Il churn dei gestori si decide nei primi 60 giorni: se in quel periodo non arriva almeno una prenotazione da un tiratore nuovo, il gestore conclude che lo strumento non serve, indipendentemente da quanto gli sia piaciuto l'onboarding.

| Leva | Quando | Meccanismo |
|---|---|---|
| **Onboarding assistito** | Giorno 0 | 45 minuti di persona o in videocall, dati inseriti insieme. Mai un modulo di auto-registrazione nella fase iniziale |
| **Primo valore accelerato** | Giorni 1-30 | Spinta mirata dei tiratori dell'area verso la nuova struttura: notifica ai già registrati, contenuto locale, segnalazione nelle community |
| **Report mensile** | Mensile | E-mail con: prenotazioni ricevute, clienti nuovi mai visti prima, slot più richiesti. **La metrica che conta è "clienti nuovi"**, perché è l'unica che il gestore non può ottenere altrove |
| **Eliminazione del doppio lavoro** | Da T5 | Export verso il gestionale esistente: toglie l'attrito operativo che è la causa più comune di abbandono |
| **Early adopter a vita** | Primi 50 | Prezzo bloccato a 39 €/mese per sempre. Costo contenuto, valore relazionale alto, ancoraggio contro futuri concorrenti |
| **Canale diretto** | Continuativo | WhatsApp diretto col fondatore. Non scala, ma nella fase 0-50 gestori è un vantaggio competitivo, non un limite |
| **Coinvolgimento sul prodotto** | Trimestrale | Chiedere quali funzionalità servono e implementarne almeno una visibile per trimestre |

**Metriche**: churn <5%/mese entro Anno 2; **rinnovo a 6 mesi senza incentivo >70%**; NPS gestori >45; ≥1 prenotazione nei primi 30 giorni per il 90% dei nuovi partner.

Il secondo indicatore è il più onesto: misura il valore reale, al netto della cortesia e degli sconti iniziali.

## 13.2 Retention B2C (tiratori)

Il problema strutturale del lato consumer è la **frequenza bassa**: 2,8 prenotazioni per utente all'anno (§4.4). Con quella frequenza l'app viene dimenticata tra un utilizzo e l'altro. La retention non si costruisce sull'engagement quotidiano — che sarebbe una fantasia — ma sull'**essere presenti nel momento del bisogno**.

| Leva | Meccanismo | Perché funziona con frequenza bassa |
|---|---|---|
| **Alert scadenze documentali** | Notifica a 90/30/7 giorni da porto d'arma, certificato medico, tesseramento | **La leva migliore in assoluto**: crea un contatto utile 3-4 volte l'anno indipendentemente dalle prenotazioni, e su un tema in cui dimenticarsi ha conseguenze reali |
| **Diario auto-generato** (§3.5) | La sessione si compila da sola dopo il check-in; all'utente resta da aggiungere colpi e risultati | Elimina l'attrito che fa abbandonare tutti gli altri diari di tiro dopo tre voci. **La leva di retention più forte del modulo** |
| **Contatore munizioni con soglie di legge** | Avviso all'80% dei limiti art. 97 TULPS | Crea contatti utili **indipendenti dalle sessioni**: si apre l'app per controllare le scorte, non solo per prenotare |
| **Statistiche e andamento nel tempo** | Raggio medio, estensione del gruppo, confronto tra armi e distanze | L'archivio personale accumulato diventa il costo di abbandono: i dati non si portano via da nessun'altra parte |
| **Libretto GPG** | Tre scadenze quadrimestrali obbligatorie con alert | Frequenza garantita per legge su un segmento di 44.347 licenze |
| **Notifiche stagionali** | Pre-apertura caccia (taratura), inizio campionati, riaperture dopo chiusure estive | Intercetta i picchi di intenzione reali del calendario del settore |
| **Novità nell'area** | Nuovo poligono, nuova disciplina entro X km | Ragione legittima per riaprire l'app |
| **Pass Pro** | Cancellazione gratuita last minute, promemoria, convenzioni | Solo dopo che il valore base è dimostrato (§4.2) |
| **Community e recensioni** | — | Deliberatamente **rimandate**: la moderazione in un settore sensibile è un costo e un rischio che non si possono sostenere con un fondatore unico |

**Metriche**: retention a 90 giorni >35% (Anno 2); prenotazioni per utente attivo >2/anno; NPS >40; **≥35% degli utenti che registra almeno una sessione nel diario** — con l'introduzione del modulo questo sostituisce il locker documentale come predittore più forte del ritorno, perché misura un comportamento ripetuto anziché un'azione singola.

## 13.3 Perché la gamification è rimandata

Sia la v1.0 sia le revisioni Grok/DeepSeek puntano molto su badge, punti e gamification. Con 2,8 sessioni l'anno per utente, un sistema a punti non ha carburante: il ciclo di rinforzo è troppo lento perché il meccanismo si autoalimenti. La gamification funziona con frequenze settimanali, non trimestrali.

Il sistema **Spotter**, invece, resta valido — ma è uno strumento di **qualità del dato**, non di retention, e va valutato come tale. Va introdotto solo con soglie di fiducia e anti-abuso (T6), perché un sistema a ricompensa senza controlli in un settore di nicchia produce segnalazioni false in proporzione diretta al valore del premio.

---

# SEZIONE 14: COMPLIANCE NORMATIVA E SICUREZZA DATI

## 14.1 Quadro normativo

| Ambito | Riferimento | Implicazione operativa |
|---|---|---|
| **Riordino UITS** | DL n. 108 del 26/06/2026, art. 8 | Gestione impianti centralizzata presso UITS con delega a terzi via procedure pubbliche; poligoni privati possono federarsi; DIMA solo dalle sezioni TSN; 90 giorni per lo statuto. **Da monitorare mensilmente**: i regolamenti attuativi possono cambiare l'interlocutore e le regole di accesso agli impianti |
| **Protezione dati** | GDPR, Reg. UE 2016/679 | Porto d'arma e certificato medico. Il secondo è **dato relativo alla salute, art. 9**: categoria particolare, che richiede base giuridica rafforzata |
| **Normativa armi** | TULPS, D.Lgs. 204/2010 e successive | La piattaforma non intermedia armi né munizioni. Confine da mantenere rigorosamente anche nelle funzionalità future |
| **Limiti di detenzione munizioni** | **Art. 97 TULPS** | 200 cartucce per arma corta, 1.500 per arma lunga da caccia, 1.000 spezzone senza denuncia (max 1.500), 2 kg di polvere. Base normativa del contatore munizioni (§3.5.4). **Lo strumento calcola, non certifica**: la responsabilità resta del detentore |
| **Esercitazioni obbligatorie GPG** | **DM 1 dicembre 2010 n. 269** e normativa UITS | Tre esercitazioni annuali a cadenza quadrimestrale, 50 colpi, libretto di tiro personale. Base del libretto digitale (§3.5.5) |
| **Servizi digitali e consumatori** | Codice del Consumo, D.Lgs. 70/2003 | Diritto di recesso, condizioni trasparenti, informativa precontrattuale |
| **Pagamenti** | PSD2, SCA | Delegati a Stripe: la piattaforma non tocca dati di pagamento |
| **Store** | App Store Review Guidelines, Google Play Policy | Categoria sensibile. PWA come percorso primario (§12.2, rischio 8) |

## 14.2 Trattamento dei dati sensibili

**Il certificato medico è il punto più delicato dell'intero progetto**, ed è sottovalutato sia nella v1.0 sia in tutte e tre le revisioni. È un dato sanitario ex art. 9 GDPR: il trattamento richiede una base giuridica specifica, e il consenso esplicito è ammesso ma è la base più fragile (revocabile in qualsiasi momento, e con squilibrio di potere contestabile).

Impostazione adottata:

| Misura | Attuazione |
|---|---|
| **Minimizzazione** | Salvare, dove possibile, **solo la data di scadenza** e non l'immagine del documento. Copre il caso d'uso principale (l'alert) senza trattare il dato sanitario nel merito |
| **Minimizzazione estesa al diario** (§3.5.8) | Nessun numero di matricola, nessun documento di detenzione, nessuna denuncia. L'arma è registrata per tipo e calibro. Il contatore munizioni conserva quantità e calibro, mai provenienza o estremi di acquisto |
| Cifratura lato client | Il documento è cifrato sul dispositivo prima dell'upload; la piattaforma conserva cifrato e non può leggere |
| Controllo dell'accesso | Il gestore vede solo l'esito di validità e la scadenza, mai il documento — salvo consenso puntuale dell'utente per singola sessione |
| Conservazione limitata | Cancellazione automatica alla scadenza + 30 giorni |
| Portabilità e cancellazione | Esportazione e cancellazione totale disponibili dall'app, senza richiesta al supporto |
| Base giuridica | Consenso esplicito, separato, granulare e revocabile, con informativa dedicata |
| DPIA | **Obbligatoria** (art. 35 GDPR: trattamento sistematico di dati particolari su larga scala). Da redigere prima del rilascio del locker, e **da estendere al modulo diario** prima del rilascio del contatore munizioni: quantità di munizioni detenute e frequenza di accesso ai poligoni sono dati che, pur non rientrando nell'art. 9, meritano lo stesso trattamento per il rischio che comportano in caso di violazione |

## 14.3 Ruoli e responsabilità

| Ruolo | Attribuzione | Nota |
|---|---|---|
| **Titolare** | Poligoni Italia, per i dati degli utenti della piattaforma | — |
| **Responsabile** | Poligoni Italia, per i dati trattati per conto dei gestori | Richiede un **DPA firmato con ogni gestore partner**: senza, il trasferimento dati è illegittimo |
| **DPO** | Non obbligatorio nella fase iniziale, ma **raccomandato dal rilascio del locker** | Consulente esterno, 1.200-2.400 €/anno. Da attivare in Anno 2 |
| Sub-responsabili | Hosting, Stripe, provider e-mail | DPA con ciascuno; preferire fornitori con data center UE |

## 14.4 Piano di gestione data breach

| Tempo | Azione |
|---|---|
| 0-2 h | Rilevazione (alert automatici su accessi anomali), contenimento, isolamento |
| 2-12 h | Valutazione di gravità: dati coinvolti, numero di interessati, rischio per i diritti |
| 12-72 h | **Notifica al Garante entro 72 h** se c'è rischio per i diritti (art. 33) |
| 24-72 h | Comunicazione agli interessati se il rischio è elevato (art. 34) |
| 72 h-7 gg | Registro delle violazioni, analisi delle cause, correzione |
| 7-30 gg | Comunicazione ai gestori partner, revisione delle misure |

Registro delle violazioni obbligatorio **anche per gli incidenti non notificati**. Simulazione annuale della procedura.

## 14.5 La questione della responsabilità sul check-in

Il punto più esposto dell'intero piano, e quello che un legale o un assicuratore solleverà per primo:

> Se un tiratore prenota tramite l'app e si presenta con un porto d'arma scaduto, e il gestore — fidandosi del check-in digitale — lo ammette, di chi è la responsabilità?

**Impostazione adottata, senza ambiguità:**

1. Il check-in digitale è uno **strumento di supporto**, mai un sostituto del controllo fisico all'ingresso. Il contratto con il gestore lo afferma esplicitamente;
2. La piattaforma **non certifica la validità** di alcun documento: mostra ciò che l'utente ha caricato e la data di scadenza dichiarata. La distinzione tra *mostrare* e *verificare* è giuridicamente decisiva e deve essere riflessa anche nell'interfaccia, non solo nel contratto;
3. L'interfaccia del gestore riporta un avviso permanente e non disattivabile: *"Verificare sempre i documenti originali all'ingresso"*;
4. La responsabilità dell'ammissione resta **integralmente in capo al gestore**, come è oggi e come impone la normativa di pubblica sicurezza;
5. Copertura RC professionale attivata prima del primo onboarding.

Questo punto va portato a un legale specializzato **prima** di scrivere il codice del locker, non dopo. È l'unico elemento del piano che può trasformare un fallimento commerciale in un problema personale del fondatore.

## 14.6 Audit e verifiche periodiche

| Attività | Frequenza | Chi |
|---|---|---|
| Revisione registro trattamenti | Semestrale | Fondatore + consulente |
| Verifica DPA con fornitori e gestori | Annuale | Consulente |
| Penetration test di base | Annuale da Anno 2 | Esterno |
| Simulazione data breach | Annuale | Interno |
| Monitoraggio normativo (attuazione DL 108/2026) | **Mensile** | Fondatore |
| Aggiornamento DPIA | Ad ogni cambiamento sostanziale | Consulente |

---

# SEZIONE 15: DOMANDE APERTE E PROSSIMI PASSI

## 15.1 Le dodici domande da verificare sul campo

Non sono domande retoriche: ciascuna ha una risposta che si ottiene parlando con persone reali, e ciascuna può cambiare il piano.

1. **Un direttore di sezione TSN, oggi, considera le linee vuote un problema?** Se le sezioni sono già sature nei momenti utili e i turni infrasettimanali vuoti non gli costano nulla, il valore centrale della proposta non esiste. *Verificare con 10 direttori prima di ogni altra cosa.*

2. **Chi decide davvero in una sezione TSN?** Il direttore, il presidente, il consiglio direttivo, il segretario? E come cambia con la riforma UITS? Un ciclo di vendita che richiede una delibera collegiale ha tempi e modalità completamente diversi.

3. **Un tiratore pagherebbe 1,50 € per prenotare online invece di telefonare gratis?** È l'assunzione su cui poggia il primo canale di ricavo. Testabile in un pomeriggio di conversazioni.

4. **I gestori accettano il prepagamento?** Senza pagamento anticipato non c'è transaction fee, e l'intera sequenza di monetizzazione di §4.2 cambia.

5. **Quanti dei ~370 poligoni hanno già una prenotazione online funzionante?** Determina la dimensione reale del SAM. Verificabile in circa 20 ore di lavoro su siti e telefonate — ed è forse il singolo dato più utile di tutto il piano.

6. **GESTIT e gli altri gestionali hanno in programma un layer di discovery?** Una telefonata. Se la risposta è sì, il piano cambia da competizione a partnership o a exit.

7. **Che cosa comporterà concretamente la riforma UITS per la gestione degli impianti?** Se UITS gestirà centralmente le prenotazioni, il mercato TSN si chiude e resta il solo segmento privato.

8. **Un gestore accetterebbe di scaricare parte della verifica documentale su un sistema terzo?** Se la risposta è no — plausibile — il locker perde gran parte del valore B2B e resta una funzionalità B2C.

9. **Quanto tempo settimanale è realisticamente disponibile, nei mesi peggiori dell'anno?** Non nella media: nel peggiore. L'intera roadmap è calibrata su questo numero e sopravvalutarlo è il modo più comune di far fallire un piano bootstrap.

10. **Un tiratore tiene già un diario di tiro, in qualunque forma?** Se non lo tiene su carta, difficilmente lo terrà su un'app. E se lo tiene, su cosa — quaderno, foglio di calcolo, MyGuns? La risposta dice se il modulo §3.5 risolve un'abitudine esistente o se deve crearne una, che è un lavoro dieci volte più difficile.

11. **Quante munizioni pensi di avere in casa adesso, esattamente?** Domanda da porre a bruciapelo nelle interviste. Se le persone rispondono con un numero preciso, il contatore munizioni non serve. Se rispondono "boh, un paio di scatole", serve — ed è la conferma dell'assunzione critica n.5.

12. **Esiste una persona con radici nel settore disposta a entrare come co-fondatore commerciale?** È la mitigazione del rischio n.1 (§10.5) e vale più di qualsiasi altra decisione presa in questo documento.

## 15.2 Prossimi passi — settimane 1-4

Dimensionati su circa 15 ore a settimana.

### Settimana 1 — Fondamenta
- [ ] Costruire il foglio di censimento (struttura dati definitiva: contatti, orari, listino, discipline, calibri, booking esistente, fonte, data di verifica)
- [ ] Estrarre l'elenco completo delle sezioni TSN dalle 3 province candidate (ricerca sezioni UITS) e incrociarlo con la mappa dei poligoni privati
- [ ] Applicare il punteggio di §5.3 e **scegliere la provincia pilota**
- [ ] Contattare un legale specializzato in privacy/sport per un preventivo su contratto gestori + informativa + DPA

### Settimana 2 — Primo contatto
- [ ] Censire da fonti pubbliche tutte le strutture della provincia scelta (obiettivo: 40)
- [ ] Verificare quante hanno già una prenotazione online (risponde alla domanda 5)
- [ ] Preparare la traccia di intervista per i gestori: 8 domande aperte, nessun accenno al prodotto
- [ ] Chiamare i primi 5 gestori chiedendo **un'intervista, non un appuntamento commerciale**
- [ ] Telefonare a GESTIT come potenziale partner (risponde alla domanda 6)

### Settimana 3 — Ascolto
- [ ] 5 interviste a gestori, di persona dove possibile
- [ ] Iscriversi e osservare 3 community locali di tiratori senza intervenire
- [ ] 10 conversazioni con tiratori: come scelgono, come prenotano, cosa li blocca
- [ ] Testare la disponibilità a pagare la fee (domanda 3) in almeno 8 di queste conversazioni
- [ ] Attivare il numero WhatsApp Business

### Settimana 4 — Prima verità
- [ ] 5 ulteriori interviste a gestori (totale 10)
- [ ] Attivare il concierge: proporsi nelle community come servizio manuale di ricerca e prenotazione
- [ ] **Obiettivo: la prima prenotazione reale gestita a mano**
- [ ] Sintesi scritta: le tre cose imparate che contraddicono questo business plan
- [ ] Decisione documentata su come proseguire

L'ultimo punto della settimana 4 è il più importante. Un piano che sopravvive intatto a dieci conversazioni con clienti reali è quasi sempre un piano a cui non sono state fatte le domande giuste.

---

# NOTA METODOLOGICA

## Le fonti effettivamente disponibili

Il brief di questo lavoro assumeva cinque revisioni indipendenti (consulente, Gemini, Grok, Perplexity, Claude). La verifica dei file ha dato un quadro diverso, che va dichiarato perché condiziona il peso dato a ciascun contributo:

| File | Contenuto reale |
|---|---|
| `Claude Review.txt` | Revisione reale, con verifica web dei dati e meta-analisi delle altre |
| `Grok_Review.txt` | Revisione reale |
| `DeepSeek_Review.txt` | Revisione reale, **quasi identica a Grok**: stessa struttura, stesse tabelle, stessi numeri, stessi competitor, stesso pricing |
| `Perplex Review.txt` | **Copia del prompt originale**, non una revisione |
| Revisione Gemini | **Assente** |
| `RICERCA_MERCATO.md` | Ricerca di mercato dedicata (31/07/2026), non una revisione del business plan: mappa competitor Italia/Europa. Contiene un claim di first-mover non verificato con lo stesso rigore delle fonti primarie italiane (§2.5.5) — trattato con lo stesso scetticismo riservato al claim analogo della v1.0 (§1.5). Il contributo verificato e integrato è **ML Armory** (§3.5.3-bis) |

**Le voci indipendenti sono due, non cinque.** Grok e DeepSeek sono state trattate come una fonte sola. Questo cambia la logica di risoluzione delle divergenze: un punto sostenuto da "Grok + DeepSeek" contro Claude è 1-1, non 2-1. Il criterio "must-fix se convergono tre o più revisioni", previsto dal brief, non era applicabile, ed è stato sostituito dal criterio: **verifica indipendente delle fonti primarie**.

## Come sono state risolte le divergenze

| Divergenza | Decisione | Criterio |
|---|---|---|
| Pricing e sequenza dei canali | Sequenza a fasi con trigger quantitativi | Verifica competitiva: l'esistenza di gestionali incumbent rende il canone un confronto frontale evitabile. Argomento nuovo, non presente in nessuna revisione |
| Piano finanziario | Bottom-up bootstrap (~10 k€ Anno 1) | Coerenza con lo scenario reale confermato dal fondatore. I 252 k€ sono un benchmark, non un calcolo |
| Città pilota | Criterio di selezione, non lista | La raggiungibilità fisica dal fondatore è un vincolo che nessuna revisione considerava |
| First-mover | Rimosso | Falsificato dalla ricerca (§2.5). Nessuna revisione lo aveva verificato |
| Resistenza gestori: debolezza o minaccia | Minaccia | È una caratteristica del mercato, non un difetto del progetto. Distinzione utile perché indica che si affronta col modello di ingaggio, non con più sforzo |
| Primo assunto | BD part-time | Calcolo del tetto di onboarding in §10.3: quantifica un'intuizione presente in una sola revisione |
| Freemium con 5 prenotazioni/mese | Respinto | Limitare le prenotazioni gratuite limita la liquidità proprio quando serve. Il confine Free/Pro è il risparmio di lavoro, non il volume |
| Architettura a microservizi | Respinta | Ai volumi previsti è una complessità che consuma il tempo del fondatore senza risolvere un problema esistente |
| Gamification | Rimandata | Incompatibile con una frequenza d'uso di 2,8 sessioni/anno |
| 440 poligoni, >100.000 tesserati | Ricostruiti | Il primo sostituito da una stima con metodo dichiarato (370-450); il secondo ha ora una fonte citabile (La Verità) |

## Che cosa questo documento aggiunge rispetto a tutte le revisioni

1. **La mappa competitiva reale** — GESTIT, T.A.R.G.E.T., Esposito, ArMa e i booking TSN già attivi. Nessuna revisione li aveva individuati, e la loro esistenza smonta il claim di first-mover;
2. **Il riposizionamento del modulo B2B** da sostituto a complemento dei gestionali, che discende direttamente dal punto precedente e modifica pricing, GTM e roadmap;
3. **La riforma UITS (DL 108/2026)** come fattore strategico centrale. La v1.0 la citava in una riga di compliance; nessuna revisione l'ha analizzata. È il fatto più rilevante accaduto al settore in vent'anni e cade dentro la finestra del piano;
4. **La segmentazione della domanda** con l'osservazione che i segmenti di maggior valore sono quelli oggi non serviti — che riscrive la strategia di comunicazione;
5. **Il vincolo reale del fondatore quantificato**: CAC in ore anziché in euro, tetto di onboarding calcolato, roadmap dimensionata su 15 ore a settimana;
6. **Trigger quantitativi** su ogni decisione rilevante (attivazione canali, round, contingenze), al posto di scadenze temporali arbitrarie;
7. **La distinzione tra break-even di cassa e break-even economico**, che nessuna revisione faceva e che è il primo punto su cui un investitore fa domande a un piano bootstrap;
8. **Il modulo "Il Mio Tiro" (§3.5)** con il contatore munizioni conforme all'art. 97 TULPS e il libretto di tiro digitale per le guardie giurate: due funzionalità che nessuna delle app concorrenti censite offre, perché sono tutte estere o non conoscono l'ordinamento italiano. È anche la risposta strutturale al problema di frequenza d'uso che la v1.0 e le revisioni lasciavano irrisolto;
9. **ML Armory** (§3.5.3-bis) come concorrente italiano diretto sul modulo diario/inventario, non censito da nessuna revisione: ne discendono due funzionalità aggiunte alla roadmap Anno 2 (ricette di ricarica con scalaggio automatico, cronografia) e un chiarimento esplicito sul perché il modello privacy zero-account di ML Armory non è replicabile senza rinunciare alla leva della sessione auto-generata (§3.5.8).

## Limiti dichiarati

- Il numero di poligoni resta una stima (370-450). Il censimento diretto della fase T1 lo sostituirà con un dato;
- La stima di 250.000 praticanti attivi è un'elaborazione propria, non un dato di fonte;
- I contributi Sport e Salute sono verificati per FITAV, UITS e FIDASC; per FITDS è disponibile solo la variazione percentuale;
- Non è stato possibile reperire i tesserati disaggregati per federazione: i documenti CONI e Sport e Salute che li contengono non erano raggiungibili al momento della verifica (HTTP 503). **Da recuperare**: sono il dato più utile ancora mancante;
- Il pricing dei gestionali incumbent non è pubblico e non è stato verificato: il posizionamento a 39-59 € è ragionato, non validato su benchmark;
- Tutte le proiezioni finanziarie sono ipotesi. Il progetto non ha oggi utenti, gestori né ricavi.

---

# ASSUNZIONI CRITICHE DA VERIFICARE

Sei assunzioni che, se false, invalidano il piano. Per ciascuna: come si testa alla spesa minima e cosa fare se cade.

### 1. I gestori percepiscono le linee vuote come un problema economico

*Se falsa*: viene meno la proposta di valore B2B e l'intero lato dell'offerta. Il progetto si riduce a una directory informativa.

**Test — 250 €, 3 settimane.** 10 interviste a direttori, con una domanda chiave che non ammette risposte di cortesia: *"Quante linee sono vuote il martedì pomeriggio e quanto vi costa?"*. Se non sanno rispondere, non è un problema che percepiscono.

**Se cade**: riposizionare su B2C puro (discovery e informazione, monetizzata via SEO e pubblicità). Business più piccolo, ma reale.

### 2. Il tiratore paga per non telefonare

*Se falsa*: cade il primo canale di ricavo e la sequenza di monetizzazione va riscritta.

**Test — 0 €, 1 settimana.** Nel servizio concierge manuale della settimana 4, chiedere 2 € per la prenotazione gestita. La risposta a una richiesta di pagamento reale vale infinitamente più di qualsiasi dichiarazione di intenzione.

**Se cade**: passare alla commissione sul gestore (§4.5), con impatto sulla penetrazione ma non sulla sostenibilità.

### 3. Esiste domanda B2C non servita, non solo domanda già soddisfatta

*Se falsa*: chi spara ha già il suo poligono e il suo numero di telefono. La piattaforma non aggiunge nulla.

**Test — 300 €, 2 settimane.** Una landing page per la provincia pilota con le strutture censite e un form "trova dove sparare". Misurare traffico organico e richieste **senza pubblicità a pagamento**: il traffico organico è l'unico segnale non comprato.

**Se cade**: il progetto non ha mercato B2C e resta solo il software gestionale — dove però gli incumbent sono più forti. **È l'assunzione la cui caduta è più difficile da recuperare.**

### 4. I dati si mantengono aggiornati a costo sostenibile

*Se falsa*: la piattaforma degrada in una directory di informazioni sbagliate, che è peggio dell'assenza di piattaforma.

**Test — 0 €, 3 mesi.** Misurare durante la fase T1 quante ore servono per verificare e aggiornare 40 strutture, e quante cambiano informazione in un trimestre. Se servono più di 10 ore al mese per 40 strutture, il modello non scala a 300 senza automazione o community.

**Se cade**: restringere il perimetro alle sole strutture partner che si auto-gestiscono, rinunciando alla copertura totale — e quindi al vantaggio principale.

### 5. Il diario viene usato più di una volta

*Se falsa*: il modulo "Il Mio Tiro" non produce né retention né conversione a Pass Pro, e le 13 settimane investite sono perse. È il rischio classico di tutti i diari di tiro: si registrano tre sessioni e si smette.

**Test — 0 €, 6 settimane, prima di scrivere il codice.** Nel concierge manuale, inviare a ogni tiratore servito un messaggio dopo la sessione: *"Quanti colpi hai sparato oggi? Con quale arma?"*, e restituire a fine mese un riepilogo scritto a mano con consumo munizioni e residuo rispetto al limite di legge. Se le persone rispondono e chiedono il riepilogo del mese successivo, la domanda esiste. Se smettono di rispondere alla seconda volta, non esiste.

**Se cade**: mantenere solo il contatore munizioni e il libretto GPG, che rispondono a obblighi di legge e non dipendono dalla motivazione dell'utente, e rinunciare a diario, statistiche e analisi dei bersagli.

### 6. La riforma UITS non chiude il mercato

*Se falsa*: se UITS centralizza anche la prenotazione, il segmento TSN (~300 strutture su ~370) diventa inaccessibile.

**Test — 0 €, continuativo.** Monitorare mensilmente lo statuto e i regolamenti attuativi; contattare due comitati regionali per capire come si stanno orientando.

**Se cade**: ripiegare sul segmento privato (~70 strutture in crescita, e il DL apre loro la federazione) e sulle federazioni non UITS. Mercato più piccolo, ma con gli early adopter migliori (§2.4).

---

# CHECKLIST PER DUE DILIGENCE

Ciò che un investitore competente verificherebbe. Utile prima di tutto al fondatore: ogni riga a cui oggi non si sa rispondere è un elemento da costruire.

### Mercato
- [ ] Il numero di poligoni è verificabile con fonte, o è una stima con metodo dichiarato?
- [ ] Il TAM è calcolato o asserito? La formula è esposta?
- [ ] Quanti poligoni hanno già una prenotazione online? (dimensiona il SAM reale)
- [ ] La crescita delle licenze si traduce in maggiore frequentazione dei poligoni, o solo in più licenze?

### Concorrenza
- [ ] Esiste un censimento verificato dei gestionali attivi nel settore?
- [ ] È stato contattato almeno un incumbent per capirne le intenzioni?
- [ ] Che cosa impedisce a GESTIT di aggiungere la discovery in sei mesi?
- [ ] Che cosa succede se una grande sezione replica il modello a livello regionale?

### Prodotto e trazione
- [ ] Quante prenotazioni reali sono state gestite, anche manualmente?
- [ ] Quanti gestori hanno firmato, e quanti pagano?
- [ ] Qual è il liquidity rate misurato?
- [ ] Retention gestori a 6 mesi **senza incentivi**?
- [ ] Percentuale di dati aggiornati a 30 giorni?

### Modello economico
- [ ] La disponibilità a pagare è stata testata con richieste di pagamento reali, o solo dichiarata?
- [ ] Chi paga la fee, e questa scelta è stata validata?
- [ ] CAC misurato o stimato? Include il costo del tempo del fondatore?
- [ ] LTV basato su churn osservato o ipotizzato?

### Team
- [ ] Il fondatore ha competenze commerciali, o solo tecniche?
- [ ] Quanto tempo dedica realmente, e quanto è sostenibile?
- [ ] Esiste un piano di successione o continuità?
- [ ] L'onboarding è stato eseguito con successo da qualcuno che non sia il fondatore?

### Legale e rischio
- [ ] Esiste un parere legale sulla responsabilità del check-in documentale?
- [ ] La DPIA è stata redatta prima del rilascio del locker?
- [ ] I DPA con i gestori sono firmati?
- [ ] Esiste copertura assicurativa RC professionale?
- [ ] Come impatta il DL 108/2026 sull'accesso al mercato?
- [ ] Il piano dipende dalla pubblicazione sugli app store?

### Finanza
- [ ] Le proiezioni sono bottom-up o benchmark?
- [ ] Il break-even è di cassa o economico? Il fondatore è retribuito nel calcolo?
- [ ] Qual è il runway effettivo?
- [ ] Quali sono le 3 assunzioni più sensibili, e qual è l'impatto se cadono?

---

# ALLEGATI

## Allegato A — Fonti

### Dati verificati

| Dato | Valore | Fonte | URL |
|---|---|---|---|
| Porti d'arma 2025 (tutte le categorie) | 1.275.930 | Polizia di Stato via Armi e Tiro | https://www.armietiro.it/porti-darma-2025-boom-per-caccia-e-tiro-a-volo |
| Porti d'arma uso caccia 2025 | 634.471 (da 588.043) | Idem | Idem |
| Porti d'arma uso tiro a volo 2025 | 588.145 (da 553.392) | Idem | Idem |
| Porti d'arma difesa personale 2025 | 8.967 (da 9.891) | Idem | Idem |
| Porti d'arma guardie giurate 2025 | 44.347 (da 42.389) | Idem | Idem |
| Contributi Sport e Salute 2026, totale | 344,4 M€ | Sport e Salute | https://www.sportesalute.eu/primo-piano/assegnazione-dei-contributi-agli-organismi-sportivi-2026.html |
| Contributi comparto tiro 2026 | oltre 13 M€ | La Verità | https://www.laverita.info/tiro-sportivo-italia-crescita-2026-2674856865.html |
| Contributo FITAV 2026 | 7.198.719 € | Sport e Finanza / Calcio e Finanza | https://www.sportefinanza.it/2025/12/24/sport-e-salute-contributi-federazioni-sportive/ |
| Contributo UITS 2026 | 4.074.882 € | Idem | Idem |
| Contributo FIDASC 2026 | 1.557.757 € | Idem | Idem |
| Tesserati federazioni del tiro | oltre 100.000 | La Verità | https://www.laverita.info/tiro-sportivo-italia-crescita-2026-2674856865.html |
| Sezioni TSN | ~300 (altra fonte: 279) | Wikipedia / UITS | https://it.wikipedia.org/wiki/Unione_Italiana_Tiro_a_Segno |
| Poligoni privati censiti | ~70, in crescita | Armi e Tiro | https://www.armietiro.it/la-mappa-armi-e-tiro-dei-poligoni-privati-armi-7000 |
| DL 108/2026, art. 8 — riordino UITS | pubblicato 26/06/2026 | UITS / Armi e Tiro / GUNSweek | https://www.armietiro.it/il-riordino-delluits-e-in-gazzetta-ufficiale |
| Contenuti della riforma UITS | vedi §1.6 | UITS | https://www.uits.it/homepage/news/8-istituzionale/13046-art-8-del-decreto-legge-n-108-2026-%E2%80%93-riordino-dell%E2%80%99unione-italiana-tiro-a-segno-2.html |
| Contestazione della riforma | proteste delle sezioni | Malpensa News / Pordenone Today | https://www.malpensanews.it/2026/07/il-governo-centralizza-il-tiro-a-segno-nazionale-la-protesta-delle-sezioni-varesine-e-un-esproprio/956212/ |
| Elenco sezioni TSN (strumento di ricerca) | — | UITS | https://www.uits.it/homepage/sezioni/ricerca-sezioni.html |
| Limiti detenzione munizioni (art. 97 TULPS): 200 arma corta, 1.500 caccia, 1.000-1.500 spezzone, 2 kg polvere | vedi §3.5.4 | all4shooters.it | https://www.all4shooters.com/it/tiro/munizioni/quantita-delle-cartucce-detenibili-in-italia/ |
| Idem — conferma indipendente | Idem | Gazzetta delle Armi | https://www.gazzettadellearmi.it/2019/02/25/cartucce-limiti-e-modalita-di-detenzione/ |
| Obbligo GPG: 3 esercitazioni/anno quadrimestrali, 50 colpi, libretto di tiro | vedi §3.5.5 | DM 269/2010 via earmi.it; UITS | https://www.earmi.it/diritto/leggi/refolamento%20guardie.htm |
| Normativa UITS su porto d'armi GPG | — | UITS | https://www.uits.it/homepage/news/8-istituzionale/7625-normativa-sul-porto-d-armi-per-guardie-giurate-validita-2-anni.html |
| Registro frequenze e libretto di tiro nelle sezioni | — | TSN Busto Arsizio, TSN Torino | https://www.tsnbusto.com/area-istituzionale/certificazioni/ |
| ML Armory: funzionalità (inventario, cassaforte, ricette di ricarica, cronografia, obiettivi), roadmap, modello privacy zero-account | vedi §3.5.3-bis | ML Armory / Armimagazine.it | https://www.mlarmory.com |

### Dati NON verificati — da non usare come definitivi

| Dato | Stato |
|---|---|
| "~440 poligoni mappati" (v1.0) | **Nessuna fonte trovata.** Sostituito da stima 370-450 con metodo dichiarato |
| Tesserati disaggregati per federazione | Non reperiti: documenti CONI e Sport e Salute non raggiungibili (HTTP 503). Da recuperare |
| Pricing dei gestionali incumbent | Non pubblico |
| "Ticketinghub" come concorrente | Citato dalle revisioni, **non verificato** |
| Cifre advertising (500 €/mese, 5.000 €/evento) | Invenzioni delle revisioni. **Omesse** |
| Dimensione e maturità dei mercati europei (UK, Germania, Polonia, Francia — §2.5.5) | Fonti secondarie della ricerca di mercato del 31/07/2026, non verificate con fonti primarie. Il claim di "first-mover europeo" e la raccomandazione "Polonia come primo mercato" **non sono adottati**: fuori perimetro dei primi 18 mesi (§2.5.5) |

## Allegato B — Benchmark competitor

| Concorrente | Tipo | Copertura | Verticale tiro | Pricing | URL |
|---|---|---|---|---|---|
| GESTIT | Gestionale amministrativo | Multi-sezione | **Sì**, completo (registri di legge) | Non pubblico | https://www.gestionetsn.it/ |
| T.A.R.G.E.T. (Old Fox) | Gestionale | Multi-impianto | **Sì** | Non pubblico | https://www.target-software.it/ |
| Esposito Software | Gestionale | Poligoni privati | **Sì** | Non pubblico | https://www.espositosoftware.it/gestione_tiratori_poligono.htm |
| New Time snc | Gestionale | — | **Sì** | Non pubblico | https://www.newtimesnc.it/product-category/software/software-gestionale-poligoni-di-tiro/ |
| ArMa Informatica | Sviluppo su commessa | Singola sezione | Sì, su commessa | A progetto | https://www.armainformatica.it/portfolio_page/tsn-mirano-gestionale-per-prenotazioni/ |
| Anolla | SaaS sportivo | Internazionale | **No** (non menziona i poligoni) | A consumo + piano free | https://anolla.com/ |
| Booking TSN proprietari | Soluzioni singole | Singola struttura | Sì | — | tsnthiene.it, tsneste.it, tsncatania.it |

### Concorrenti sul modulo "Il Mio Tiro" (§3.5)

| Prodotto | Origine | Diario | Scoring da foto | Munizioni | Limiti legge IT | Prenotazione | Prezzo | URL |
|---|---|---|---|---|---|---|---|---|
| **MyGuns** | Svizzera | ✓ | ✓ (risultati) | ✓ scarico automatico | **✗** | **✗** | Free + piani a pagamento | https://www.myguns.app/it |
| **ML Armory** | Italia | ✓ | ✗ | ✓ + **ricette ricarica** | **✗** | **✗** | Freemium/Premium | https://www.mlarmory.com |
| **TargetScan** | UK | parziale | ✓ **80+ discipline** | ✗ | ✗ | ✗ | A pagamento | https://apps.apple.com/us/app/targetscan-pistol-rifle/id448045769 |
| **Shotlog** | Intern. | ✓ | ✗ | ✗ | ✗ | ✗ | Free + Pro | https://shotlog.app/ |
| **ShotScore** | USA | ✓ | ✓ automatico | parziale | ✗ | ✗ | — | https://apps.apple.com/us/app/shotscore-ai-target-scoring/id6761975477 |
| **Notch** | USA | ✓ | ✓ ML on-device | ✗ | ✗ | ✗ | — | https://apps.apple.com/us/app/notch-target-scoring-tracker/id6747980153 |
| **MantisX / TitanX** | USA | ✓ | ✗ (sensore) | ✗ | ✗ | ✗ | Hardware | https://mantisx.com/ |
| **Armorer Pro / Barrel Burner / Zeroed** | USA | conteggio colpi | ✗ | ✓ | ✗ | ✗ | Free + Pro | https://armorer.app/ |
| **Beretta Shooting Data** | Italia | ✓ + diario mentale | ✗ | ✗ | ✗ | ✗ | Free | https://apps.apple.com/it/app/shooting-data/id1351785879 |
| **POLIGONI ITALIA** | **Italia** | **✓ auto-generato** | ✓ marcatura manuale | ✓ | **✓ art. 97 TULPS** | **✓** | Free + Pass Pro | — |

Le due colonne che nessun concorrente riempie sono **limiti di legge italiani** e **prenotazione**. Sono anche le due che non si possono aggiungere senza aver prima costruito, rispettivamente, la competenza normativa e la rete di poligoni.

**Osservazione di sintesi**: nessun concorrente combina copertura nazionale e verticalità sul tiro. Tutti i verticali sono gestionali amministrativi mono-struttura o multi-sezione; tutti i nazionali sono orizzontali e generici.

## Allegato C — Dettaglio costi di sviluppo

Stima in settimane-uomo del fondatore, valorizzata a 40 €/h × 20 h/settimana = 800 €/settimana come costo opportunità (non un esborso).

| Componente | Settimane | Costo opportunità | Fase |
|---|---|---|---|
| Modello dati e backend base | 3 | 2.400 € | T2 |
| Ricerca geolocalizzata e mappa | 3 | 2.400 € | T2 |
| Schede struttura e pagine SEO | 2 | 1.600 € | T2 |
| Area gestore (auto-gestione dati) | 2 | 1.600 € | T2 |
| Richiesta disponibilità e notifiche | 1 | 800 € | T2 |
| **Totale vetrina (T2)** | **11** | **8.800 €** | |
| Motore di prenotazione e slot | 8 | 6.400 € | T3 |
| Planner gestore | 6 | 4.800 € | T3 |
| PWA installabile | 2 | 1.600 € | T3 |
| **Totale prenotazione (T3)** | **16** | **12.800 €** | |
| Integrazione Stripe e fee | 5 | 4.000 € | T4 |
| Check-in QR | 4 | 3.200 € | T4 |
| Locker documentale (con cifratura client-side) | 6 | 4.800 € | T4 |
| **"Il Mio Tiro" v1**: diario auto-generato, contatore colpi, inventario e **contatore munizioni art. 97** | **6** | **4.800 €** | T4 |
| **Totale monetizzazione (T4)** | **21** | **16.800 €** | |
| Export e integrazioni gestionali | 2 | 1.600 € | T5 |
| **"Il Mio Tiro" v2**: foto bersaglio, marcatura manuale, statistiche del gruppo, manutenzione per colpi, esportazione | **5** | **4.000 €** | T5 |
| **Libretto di tiro GPG** con scadenze quadrimestrali | 2 | 1.600 € | T5 |
| Spotter con anti-abuso | 5 | 4.000 € | T6 |
| App nativa (opzionale) | 8 | 6.400 € | T6+ |
| **Totale evolutive (T5-T6)** | **22** | **17.600 €** | |
| **TOTALE 18 MESI** | **70 settimane-uomo** | **56.000 €** | |
| *Rilevamento automatico fori (CV) — **escluso**, condizionato a §3.5.7* | *(10)* | *(8.000 €)* | *T6+* |

**Lettura corretta di questa tabella.** I 56.000 € non sono un esborso: sono il valore del lavoro del fondatore, che in regime bootstrap non viene pagato. Servono a due cose. Primo, a dimensionare il costo reale del progetto in una eventuale trattativa con investitori (il fondatore conferisce ~56 k€ di lavoro, ~45 k€ nella versione con app nativa e Spotter rinviati). Secondo, a rendere visibile il costo di ogni funzionalità: il locker documentale costa 6 settimane e comporta il rischio legale più alto del piano, mentre il contatore munizioni ne costa 3 ed è la funzione a più alto punteggio RICE dell'intero prodotto (§11.3).

### Il modulo diario non entra nel piano senza tagliare qualcosa

Questo è il punto in cui l'aggiunta di §3.5 va guardata in faccia invece che festeggiata.

Distribuite su 18 mesi (78 settimane), **70 settimane-uomo richiedono circa 1.400 ore, cioè ~18 ore a settimana costanti**. Il limite di sostenibilità stimato in §10 è di ~15 ore. **Il piano così com'è eccede del 20% la capacità del fondatore**, e un piano che eccede la capacità non slitta in modo ordinato: si rompe sulla funzionalità che capita di avere in mano nel trimestre peggiore.

Le opzioni sono tre, e vanno scelte adesso, non al mese 14:

| Opzione | Settimane | Ore/settimana | Conseguenza |
|---|---|---|---|
| Piano completo | 70 | 17,9 | **Non sostenibile** |
| **Rinviare l'app nativa** (la PWA copre il 90% dei casi d'uso, §12.2) | **62** | **15,9** | **Raccomandata.** Costo quasi nullo: l'app nativa non è un requisito, è una preferenza |
| Rinviare anche lo Spotter ad Anno 2 | 57 | 14,6 | Margine reale. Lo Spotter è comunque inutile prima di una massa critica di utenti (§13.3) |

**Raccomandazione: rinviare app nativa e Spotter, entrambe già segnalate altrove come non urgenti.** Si liberano 13 settimane, esattamente quante ne costa il modulo diario. Il piano torna a 14,6 ore a settimana e acquisisce il margine che oggi non ha.

Il principio generale resta quello enunciato in §3.5.9: **qualsiasi funzionalità aggiuntiva va compensata togliendone un'altra, non aggiungendo ore.** Il modulo "Il Mio Tiro" è un'ottima aggiunta al prodotto; non è un'aggiunta gratuita al piano.

---

*Documento redatto il 29 luglio 2026, aggiornato il 31 luglio 2026 con l'integrazione della ricerca di mercato su ML Armory e sul panorama europeo (§2.5.5, §3.5.3-bis). Dati verificati alle rispettive date. Le fonti sono elencate nell'Allegato A; le stime proprie sono segnalate come tali nel corpo del testo.*
