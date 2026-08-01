export interface Guide {
  slug: string;
  title: string;
  description: string;
  content: string[];
}

/**
 * Contenuti di servizio (BP §6.3): alimentano la SEO e servono il segmento
 * neofita, il più prezioso secondo l'analisi della domanda (BP §2.3).
 */
export const GUIDES: Record<string, Guide> = {
  'come-usare-poligoni-italia': {
    slug: 'come-usare-poligoni-italia',
    title: 'Come usare Poligoni Italia',
    description:
      'Scopri come cercare un poligono, filtrare per calibro o disciplina e inviare una richiesta di disponibilità senza telefonare.',
    content: [
      'Poligoni Italia raccoglie le strutture di tiro sportivo in Italia con orari, calibri ammessi e disponibilità, così non devi telefonare per sapere se c’è una linea libera.',
      '## Cerca',
      'Dalla home o da "Cerca poligoni" filtra per posizione, tipo di struttura (sezione TSN, poligono privato, tiro a volo, campo dinamico, long range) o cerca per nome, città e provincia.',
      '## Confronta',
      'Sulla scheda di ogni struttura trovi orari di apertura (quando disponibili), linee di tiro, calibri ammessi, discipline praticate e, se il gestore le ha inserite, listino e servizi.',
      '## Richiedi la linea',
      'Invia una richiesta di disponibilità direttamente dalla scheda struttura: arriva al gestore senza bisogno di una telefonata.',
    ],
  },
  'discipline-tiro-sportivo': {
    slug: 'discipline-tiro-sportivo',
    title: 'Guida alle discipline di tiro sportivo',
    description:
      'Tiro a segno statico, IPSC, tiro a volo, long range, tiro dinamico: differenze, tipo di struttura richiesto e cosa aspettarti.',
    content: [
      'Ogni struttura su Poligoni Italia è classificata per tipo — questo determina quali discipline puoi praticarci.',
      '## Tiro a segno statico',
      'Tiro su bersaglio fisso a distanza definita (10 m per aria compressa, 25 m e 50 m per armi a fuoco). Comprende discipline ISSF (olimpiche) e non ISSF: precisione, stabilità e controllo del grilletto sono gli elementi centrali. È la disciplina delle **sezioni TSN** (Tiro a Segno Nazionale, UITS).',
      '## IPSC / Tiro pratico',
      'Disciplina che unisce precisione, potenza e velocità (motto: *Diligentia, Vis, Celeritas*). Il tiratore completa percorsi di tiro (stage) in movimento, colpendo bersagli statici o mobili nel minor tempo possibile e con il maggior punteggio. Riconosciuta dal CONI come disciplina sportiva associata (FITDS). Si pratica nei **poligoni privati** con campo dinamico attrezzato.',
      '## Tiro a volo',
      'Discipline su bersagli mobili (piattelli d\'argilla) lanciati da macchine: le specialità principali sono Trap (Fossa Olimpica), Skeet e Double Trap. Il tiratore abbatte i piattelli in volo con un fucile a canna liscia. Richiede un **campo tiro a volo** dedicato (FITAV).',
      '## Long range',
      'Tiro a grandi distanze, tipicamente oltre i 300-350 metri fino a oltre 1.000. Richiede capacità balistiche avanzate, ottiche di precisione e conoscenza dei fattori ambientali (vento, umidità, effetto Coriolis). Disciplina regolamentata UITS, richiede un **campo long range** autorizzato.',
      '## Tiro dinamico',
      'Termine ampio che include l\'IPSC e altre discipline affini che combinano movimento, velocità e precisione. Il tiratore si sposta tra diverse postazioni, affronta bersagli multipli e deve gestire in sicurezza ricariche tattiche e cambi di arma. Si pratica in un **campo dinamico**.',
    ],
  },
  'limiti-munizioni': {
    slug: 'limiti-munizioni',
    title: 'Limiti di detenzione munizioni: art. 97 TULPS',
    description:
      'Guida ai limiti di detenzione delle munizioni secondo l’art. 97 del Regolamento di esecuzione del TULPS. Categorie, quantità massime e obblighi di denuncia.',
    content: [
      'La norma di riferimento è l\'**art. 97, comma 1, del Regolamento di esecuzione del TULPS** (Regio Decreto 6 maggio 1940, n. 635). I limiti massimi di detenzione per un privato munito dei necessari titoli di polizia (porto d\'armi o nulla osta all\'acquisto) sono:',
      '- Cartucce per **fucile da caccia** (a munizione spezzata/pallini o a palla unica): **1.500**;',
      '- Cartucce per **arma corta** (pistola o rivoltella): **200**;',
      '- Polvere da sparo per ricarica: **5 kg**.',
      '## Obblighi di denuncia',
      'Conoscere il limite massimo non basta: vanno rispettate le soglie di denuncia alle autorità competenti (Questura o Comando Carabinieri).',
      '- **Cartucce a pallini (spezzata)**: esenti da denuncia fino a 1.000 unità. Dalla 1.001ª alla 1.500ª unità la detenzione è legittima ma **deve essere obbligatoriamente denunciata**.',
      '- **Cartucce a palla unica (anche da caccia) e cartucce per arma corta**: devono essere **sempre denunciate**, indipendentemente dalla quantità posseduta, anche una sola cartuccia.',
      '## Le carabine sportive: un caso da verificare',
      'Il limite di 1.500 cartucce si applica testualmente alle munizioni per "fucile da caccia". La normativa non menziona esplicitamente le carabine sportive (es. calibri .223 Remington, .308 Winchester, .22 LR). Secondo un\'interpretazione consolidata e le prassi UITS, per queste armi si applica il limite di 1.500 cartucce, non rientrando nella categoria "arma corta". Tuttavia alcune Questure applicano ancora, in modo discrezionale, il limite delle 200 unità alle armi lunghe non classificate esplicitamente come "da caccia": **verifica sempre l\'orientamento del tuo Ufficio Armi di competenza.**',
      '## Testo normativo',
      '"Possono tenersi in deposito o trasportarsi nello Stato, senza la licenza di cui agli articoli 50 e 51 del testo unico, millecinquecento cartucce da fucile da caccia caricate a polvere e duecento cartucce cariche per pistola o rivoltella, nonché chilogrammi cinque di polvere da sparo." — Art. 97 R.D. 6 maggio 1940, n. 635, comma 1.',
      '## Cosa fare se si supera il limite',
      'Chi detiene quantità eccedenti deve richiedere alla Prefettura competente una licenza che autorizzi la detenzione eccedentaria (artt. 50-51 TULPS, R.D. 773/1931). In assenza di questa licenza, l\'eccedenza configura il reato di detenzione abusiva di munizioni.',
      '## Fonti',
      '- Art. 97 R.E. TULPS (R.D. 635/1940) e artt. 50-51 TULPS (R.D. 773/1931);',
      '- Circolari e linee guida del Ministero dell\'Interno (Direzione Centrale della Polizia Criminale);',
      '- Regolamenti e FAQ UITS (Unione Italiana Tiro a Segno).',
    ],
  },
  'documenti-richiesti': {
    slug: 'documenti-richiesti',
    title: 'Documenti richiesti: cosa portare in poligono',
    description:
      'La checklist documenti per iscriversi a una sezione TSN o accedere a un poligono privato, con le regole per i minorenni.',
    content: [
      'La documentazione richiesta varia a seconda del contesto (sezione TSN o poligono privato) e dello status del richiedente.',
      '## Iscrizione al TSN senza porto d\'armi',
      '- Certificato medico di idoneità all\'attività sportiva non agonistica con specifica "per tiro a segno" (medico di famiglia o medico sportivo);',
      '- Foto formato tessera;',
      '- Documento di identità in corso di validità;',
      '- Codice fiscale;',
      '- Frequenza della lezione obbligatoria con istruttore (maneggio armi e basi del tiro).',
      '## Iscrizione al TSN con porto d\'armi già in possesso',
      '- Fotocopia del porto d\'armi e del cedolino allegato (fronte e retro);',
      '- Foto formato tessera.',
      '## Iscrizione al TSN finalizzata alla richiesta del porto d\'armi',
      '- Certificato medico rilasciato in marca da bollo dall\'ufficiale sanitario della ASL o medico convenzionato;',
      '- Foto formato tessera;',
      '- Documento di identità e codice fiscale;',
      '- Superamento del corso teorico-pratico con test e prove di tiro (protocollo standard: 50 colpi con arma lunga e 50 colpi con arma corta, tipicamente in calibro .22 LR).',
      '## Accesso a un poligono privato',
      '- Porto d\'armi (o nulla osta all\'acquisto) in corso di validità;',
      '- Documento di identità valido;',
      '- Tessera federale (es. FITDS, FITAV) se richiesta dalla disciplina o dalla struttura;',
      '- Certificato medico sportivo (agonistico o non agonistico, a seconda dei requisiti del poligono);',
      '- Libretto di custodia (denuncia) delle armi, se si portano armi proprie.',
      '## Minorenni',
      'Per l\'accesso dei minorenni è sempre richiesta la presenza fisica e il **consenso scritto** (spesso con copia del documento di identità) di un genitore o tutore legale, nel rispetto dei limiti di età previsti dalla federazione di riferimento (es. dai 13 anni in su per le discipline FITDS con armi ad aria compressa).',
      '## Un consiglio',
      'Le checklist sopra sono un punto di partenza: requisiti e interpretazioni possono variare da sezione a sezione e da Questura a Questura. Verifica sempre con la struttura che intendi frequentare prima di presentarti.',
    ],
  },
};

export function allGuides(): Guide[] {
  return Object.values(GUIDES);
}
