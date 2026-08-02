# Poligoni Italia — istruzioni di progetto

## Git: commit e push riservati all'utente

**Non eseguire mai `git commit` o `git push` in questo repository.** Prepara le
modifiche (staging incluso, se utile), verifica che typecheck/lint/test
passino, poi segnala chiaramente cosa è pronto — il commit e il push li fa
sempre l'utente di persona.

Motivo: da agosto 2026 c'è un hook pre-commit Husky (`app/.husky/pre-commit`)
che lancia `npm run build` a ogni commit. L'utente vuole decidere lui il
momento in cui questo scatta, invece di ritrovarselo innescato mentre Claude
Code sta ancora lavorando su altro.

Se il contesto della richiesta rende ambiguo se l'utente si aspetta comunque
il commit (es. "sistema e pubblica"), chiedi conferma esplicita prima di
eseguirlo, invece di dare per scontato che questa regola non si applichi.

## Direzione di design: dark + rosso Ferrari

Confermata esplicitamente dall'utente (01/08/2026) dopo revisione di mockup
Replit e di 8 bozze logo: sito pubblico near-black + rosso Ferrari (#f10e34),
font Outfit + Space Mono, tipografia maiuscola aggressiva, raggi stretti (4-6px).
Non è un esperimento — è la direzione definitiva, sostituisce lo schema
chiaro/stone + blu BMW della v1. Dettagli e note di migrazione nel commento
in testa a `app/apps/web/app/styles/globals.css`.

**La dashboard `(gestore)` è esclusa apposta** da questo redesign — resta sul
vecchio tema blu, layout isolato con proprio CSS (vedi
`app/apps/web/app/(gestore)/layout.tsx`). Non "sistemarla" per farla
combaciare senza che l'utente lo chieda esplicitamente: è una scelta di
scope, non una dimenticanza.

Il logo scelto come direzione (tra 8 bozze confrontate) è nello stile di
`Bozze Logo/t359d.jpg`: scudo + mirino geometrico, **senza disegnare un
proiettile letterale** — scelta deliberata per leggibilità a icona piccola e
per evitare ambiguità con le policy degli app store.

## Dashboard admin (`/admin`)

Esiste una dashboard privata in `app/apps/web/app/(admin)/admin/` per
modificare le strutture (`ranges`) direttamente dal sito, aggirando la
scomodità di editare a mano via SQL su Supabase. Gate a due livelli
(middleware + controllo ripetuto in ogni Server Action) su whitelist email in
`ADMIN_EMAILS` (`.env.local`, non committata — va replicata nelle Environment
Variables di Vercel per funzionare anche in produzione). Scrive via Drizzle
diretto (stessa connessione delle query pubbliche), non via client
Supabase/RLS. V1: solo anagrafica (nome, indirizzo, comune/provincia/regione,
contatti, status). Orari/linee/listino/servizi restano fuori scope, già
coperti da `(gestore)` per le strutture rivendicate.

## Principio: mai inventare dati

Ricorrente in tutto il progetto, non solo una regola per il censimento
strutture: se un dato non è verificato, va lasciato vuoto/nullo, mai stimato
o generato plausibile. Esempi concreti già applicati:
- `todayStatus()` in `app/apps/web/lib/format.ts` distingue "Chiuso oggi" da
  "Orari non disponibili" — prima confondeva le due cose, mostrando "chiuso"
  su strutture di cui semplicemente non si conoscono gli orari.
- I numeri sui limiti munizioni (art. 97 TULPS) in `lib/guides.ts` vengono
  dalla fonte verificata che l'utente ha fornito in `app/apps/web/Guide.txt`,
  non da un mockup Replit che li riportava (in modo lievemente impreciso).
- `normalizeComune`/`normalizeProvincia`/`normalizeRegione` in
  `app/packages/db/src/queries/ranges.ts` correggono varianti di scrittura
  incoerenti tra fonti importate, mai inventano un valore assente.

## Knowledge graph del progetto

Grafo generato con la skill `graphify` (installata globalmente,
`~/.claude/skills/graphify`) in `graphify-out/` alla radice del repo — 1707
nodi, 2600 archi, estratti via AST (nessun costo LLM). Per domande
sull'architettura o le relazioni tra file, preferire `graphify query
"<domanda>"` all'esplorazione manuale quando `graphify-out/graph.json`
esiste già (vedi istruzioni della skill stessa). Rigenerare con
`/graphify --update` dopo modifiche strutturali importanti, non a ogni
commit.
