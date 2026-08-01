---
target: app/apps/web/app/(public)/page.tsx
total_score: 23
max_score: 32
na_heuristics: 7,9
p0_count: 1
p1_count: 1
timestamp: 2026-07-31T10-15-45Z
slug: app-apps-web-app-public-page-tsx
---
Method: dual-agent (A: a14c8f396c9ecfdfb · B: aafb50c00408ffde1)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Booking presented as live ("prenota senza telefonare") when no user-facing booking flow exists yet |
| 2 | Match System / Real World | 3 | Strong domain vocabulary (calibro, disciplina, art. 97 TULPS); loses a point for overpromising booking |
| 3 | User Control and Freedom | 3 | No traps; simple link navigation throughout |
| 4 | Consistency and Standards | 2 | Buttons/hero hardcode hex (`#0066b1`, `#1a1a1a`→`#000000`) instead of using `--accent`/token system; icons use the token, buttons don't — two visibly different blues in dark mode |
| 5 | Error Prevention | 4 | No forms/destructive actions on this page |
| 6 | Recognition Rather Than Recall | 3 | Icon+label pairing aids scanning |
| 7 | Flexibility and Efficiency | n/a | Static marketing page, no repeat-user shortcuts apply |
| 8 | Aesthetic and Minimalist Design | 3 | Clean grid, restrained motion; hero dilutes focus with two competing CTAs |
| 9 | Error Recovery | n/a | No interactive/error-producing elements on this page |
| 10 | Help and Documentation | 3 | "Guide" linked in header/footer but not contextual to specific claims |
| **Total** | | **23/32** | **Good (72%)** |

## Design Specificity Verdict

**LLM assessment**: Mixed — generic in structure, specific in copy. The layout (dark gradient hero, 4-card feature grid, region index, closing CTA banner, standard footer) is a templated SaaS/local-business pattern swappable to any category. Specificity comes entirely from copy: "Calcola la tua dotazione di munizioni rispetto ai limiti dell'art. 97 TULPS" is genuinely non-fakeable domain knowledge, as is "Cerca per posizione, calibro, disciplina." But the product's actual stated differentiator — "integrates rather than replaces existing B2B gestionali, not a first-mover but the only national B2C discovery layer" — is entirely absent from the page. The gestori CTA ("Gestisci... da un'unica dashboard") reads as a competing all-in-one gestionale, the exact misread the product needs to avoid per PRODUCT.md.

**Deterministic scan**: `detect.mjs` returned 0 findings (JSON `[]`) across three independent invocations (with/without globals.css, with `--no-config`) — the tool's static rule set has nothing to flag in this file pair. Browser-injected `detect.js` (live overlay) found 2 things the CLI didn't catch: an `overused-font` advisory (Inter at 100% of text — judged a likely false positive, single-font-family is a deliberate and reasonable choice here) and a real `skipped-heading` (page's `<h2>"Gestisci un poligono?"` followed by the shared layout footer's `<h4>"Esplora"`, no `<h3>` between — cross-component, attribution ambiguous between page.tsx and the route-group layout).

**Convergence**: Both assessments independently flagged the same root issue from different angles — the LLM review called out hardcoded hex bypassing the `--accent` token as a Consistency heuristic failure; the detector agent's manual token-inspection (CLI has no rule for "hardcoded hex matching an existing CSS variable") found the exact same 4 lines in page.tsx (41, 53, 123, 131). Independent convergence on the same defect from two isolated assessments is a strong signal, not a coincidence.

**Visual overlays**: Browser-injected overlay banner was visible and functional (both desktop and mobile screenshots captured); the live-server helper was started, used, and cleanly stopped afterward (verified via `ps`/`curl` post-kill).

## Overall Impression

The page is competent, clean SaaS-template execution with two real, well-chosen domain-specific copy moments (the TULPS ammunition line, the "prenota senza telefonare" pain-point framing) — but it currently oversells a booking capability that doesn't exist yet, and it's caught mid-restyle: an uncommitted BMW blue/black experiment has touched buttons and hero gradients by hand while leaving the token system, the committed green brand, and the rest of the surface untouched. The single biggest opportunity: resolve the visual-direction decision (commit to blue fully, or revert to green) before anything else, because right now the page is inconsistent in a way that reads as unfinished rather than intentional — and fix the booking-capability overclaim, because it's the one thing that will actively damage trust when a real visitor clicks through.

## What's Working

1. **"Trova un poligono, prenota senza telefonare" (H1)** — names a real, specific frustration (calling a TSN during business hours, often unanswered) instead of a generic "book online" platitude.
2. **The art. 97 TULPS feature card** — citing the actual ammunition-limit statute signals real regulatory understanding, not generic hobby-app framing.
3. **Region counts sorted descending** — putting strongest coverage first (Sicilia 17 → Molise 1) is a correct, deliberate hierarchy choice, even though the sparse tail needs separate handling (see Priority Issues).

## Priority Issues

**[P0] Hero and feature copy overstate live booking capability**
Why it matters: PRODUCT.md confirms no booking flow exists yet ("non è collegato a un flusso utente"). A first-time visitor who takes "prenota senza telefonare" and "prenota lo slot" literally hits a dead end at `/cerca` — worse for trust than an honest "richiedi disponibilità" framing, and in tension with the project's own stated data-honesty principle.
Fix: reframe both instances to match actual capability until the flow ships (e.g., "invia una richiesta di prenotazione").
Suggested command: `/impeccable clarify`

**[P1] BMW blue/black restyle is inconsistently applied — reads as unfinished, not intentional**
Why it matters: buttons hardcode `bg-[#0066b1]`/`hover:bg-[#004a87]` and hero/CTA banners hardcode `#1a1a1a`→`#000000` directly in JSX (page.tsx lines 41, 53, 123, 131) instead of using the `--accent` token that feature icons correctly reference — in dark mode this desyncs into two visibly different blues on one screen. The committed brand green (`#1b5e20`) is entirely invisible on the live page with no signal the blue is provisional. Confirmed independently by both assessments.
Fix: either commit fully (push blue through the token layer everywhere, retire hardcoded hex, pick one black temperature) or revert to green until decided — the current in-between state is actively damaging the Consistency score.
Suggested command: `/impeccable colorize`

**[P2] Hero dilutes single-audience focus — two competing CTAs in the first screen**
Why it matters: "Cerca un poligono" (tiratore) and "Aggiungi la tua struttura" (gestore) sit side by side with near-equal visual weight, forcing every visitor to do audience self-selection before understanding the product. Contradicts PRODUCT.md's own Product Principle #4 ("due pubblici, due registri").
Fix: keep the hero single-audience (tiratore); let the existing dedicated gestori CTA banner further down carry that pitch alone.
Suggested command: `/impeccable distill`

**[P2] Regions grid undercuts the "national coverage" claim it's meant to prove**
Why it matters: 5 of 15 shown regions have 1-2 structures, displayed with zero framing. This is the section most likely to be a visitor's proof point for "is this useful for me," and for a large share of visitors it currently reads as "barely covered here" — the opposite of intended effect, at exactly the page's trust-building moment.
Fix: add a coverage caveat/CTA for thin regions ("Gestisci un poligono in [regione]? Sii il primo a comparire qui") — turns a weakness into a gestore-acquisition hook.
Suggested command: `/impeccable clarify`

**[P3] Mobile header nav disappears entirely below the `md` breakpoint**
Why it matters: `<nav className="hidden ... md:flex">` has no mobile equivalent — on a 375px viewport only the logo and one CTA button remain in the header; "Cerca poligoni" and "Guide" links vanish, removing a primary recovery path for mobile users who don't want the hero's default CTA.
Fix: add a mobile menu trigger, or surface "Cerca poligoni" as a mobile-visible link/icon.
Suggested command: `/impeccable layout`

## Persona Red Flags

**Jordan (Confused First-Timer)**: Hits the P0 booking-capability mismatch head-on — takes "prenota senza telefonare" literally and hits a dead end. No trust/legitimacy signal anywhere on the page (no "chi siamo," no data-provenance note like "80 strutture verificate manualmente") for a regulated, firearms-adjacent category where that reassurance matters more than for a typical local-business directory.

**Casey (Distracted Mobile User)**: Loses header nav entirely on mobile (P3) with fewer recovery paths if the hero CTA isn't what they wanted. The regions grid stacks to a long single-column list of 15 low-differentiated links on mobile — a slow scan, not a fast decision, for a distracted user.

**Sam (Accessibility-Dependent User)**: Region grid links expose only name + bare number to a screen reader (confirmed via DOM read: "Sicilia" / "17" as plain sibling text, no unit) — reads as "Sicilia, 17" with no context unless the page heading above is retained in working memory. Positive counter-note: `prefers-reduced-motion` is correctly implemented at the token/CSS level.

## Minor Observations

- Detector found a real heading-hierarchy skip: page `<h2>"Gestisci un poligono?"` directly followed by the shared layout's `<h4>"Esplora"` footer heading, no `<h3>` between. Cross-component (page + route-group layout), narrow fix, worth a pass under `/impeccable audit`.
- Hero and gestori-CTA banner reuse an identical gradient/button treatment — the page's two "big moments" feel repeated rather than escalating toward a close.
- Footer "Per i gestori" column has only one link, thin relative to "Esplora"'s three — reads as an afterthought for the second stated audience.
- No data-freshness indicator near region counts, despite PRODUCT.md noting real but heterogeneous data quality — a small honest caveat would add credibility at near-zero cost.
- Secondary hero button uses `border-white/40` (opacity-based, non-token) — same hardcoded-vs-token pattern as P1, smaller instance.
- `overused-font` detector advisory (Inter, 100% of text) judged a likely false positive — single-family type is a deliberate, reasonable choice for this design system, not a defect.

## Questions to Consider

1. If the real differentiator is "integrates with existing gestionali, doesn't replace them," why does the homepage never say so to gestori — what would the hero's second sentence look like if that reassurance replaced the generic "manage everything from one dashboard" line?
2. This is a location-based discovery product with real regional density data on hand — why is "poligoni per regione" a plain text list instead of a map of Italy, the one visual that would be unmistakably specific to this product (thin coverage and all)?
3. If the BMW blue/black direction is genuinely still a hypothesis per PRODUCT.md, what would it take to see it applied fully for one real evaluation cycle — including the `(gestore)` surfaces currently left on the old system — rather than judging it half-migrated?
