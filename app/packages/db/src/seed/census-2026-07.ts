import { provinciaFromSigla } from './province-sigle.js';
import type { RangeType } from '../schema/ranges.js';

/**
 * Censimento secondario di luglio 2026 -- "Query di Ricerca Poligoni SQL + dati.docx"
 * fornito dal fondatore.
 *
 * NON è un censimento diretto: sono strutture note da fonti pubbliche
 * (UNASCI, stampa regionale, mappa Armi e Tiro, calendari federali FITAV/
 * FITDS), non verificate per telefono/sopralluogo. Copre ~123 delle ~440
 * strutture stimate in Italia (BP §2.1.2): un punto di partenza per il
 * censimento di T1 (Piano_Sviluppo_App.md §15.2), non il censimento stesso.
 *
 * Cosa NON contiene, deliberatamente: orari, listino, calibri, discipline,
 * servizi. Il documento originale li segnala esplicitamente come "da
 * raccogliere sul campo" -- inventarli qui ripeterebbe l'errore corretto
 * nel resto del progetto (BP audit del 30/07/2026: dati falsi attribuiti a
 * organizzazioni reali).
 *
 * DEDUPLICAZIONE rispetto al documento originale:
 * - Le liste regionali "Sicilia / FVG / Abruzzo" del documento sono
 *   ripetizioni di voci già presenti nella tabella TSN principale (stesso
 *   nome, stesso comune): omesse qui per non duplicare le righe.
 * - "Tiro a Segno Carpi" (tabella Privati) e "TSN Carpi" (tabella
 *   principale) sono tenute come DUE righe distinte: un primo tentativo di
 *   unirle (stesso telefono spostato su TSN Carpi) è stato annullato dopo
 *   un confronto con una geocodifica indipendente a livello di indirizzo
 *   (non solo di comune), che le colloca in due punti diversi di Carpi.
 *   Non è una prova, ma è un segnale sufficiente per non presentarle come
 *   certamente la stessa sezione: da verificare sul campo.
 * - "Trap Concaverde" compare sia nella tabella FITAV ("Tav Trap Concaverde",
 *   Lonato del Garda) sia nella tabella Privati (indirizzo e telefono,
 *   comune abbreviato "Lonato"): un solo record, con i dati più completi.
 * - "La Folce" compare sia nella tabella FITDS (Passignano sul Trasimeno,
 *   nessun contatto) sia nella tabella Privati ("La Folce Poligoni di
 *   Tiro", Magione, con indirizzo e telefono): stesso trattamento. Il
 *   comune riportato differisce tra le due fonti (probabile imprecisione
 *   della fonte originale, non mia): usato quello della fonte più
 *   dettagliata, da verificare sul campo.
 * - "Poligono Militare Gemona" e "Poligono Cao Malnisio" sono esclusi:
 *   entrambi uso esclusivo delle Forze Armate (Cao Malnisio confermato da
 *   fonti di stampa indipendenti -- Messaggero Veneto, Legambiente FVG --
 *   192 giornate di addestramento l'anno, oggetto di una petizione locale
 *   per la chiusura), non strutture prenotabili dal pubblico. Il documento
 *   originale non segnalava la natura militare di Cao Malnisio: errore
 *   individuato confrontando questo file con una fonte esterna, non con il
 *   documento di partenza.
 * - "Tiro a Volo Cieli Aperti", "Trap Pezzaioli", "Tav Umbriaverde",
 *   "Poggio dei Castagni", "Campi FITDS Triveneto", "Campi FITDS
 *   Emilia-Toscana" sono esclusi: il documento originale li marca "da
 *   verificare" o senza comune, non descrivono una struttura specifica.
 * - "A.B. Poligoni s.r.l." (Firenze, Via Cardinal Latino 20) è stata
 *   rimossa (31/07/2026): non è un poligono ma un'azienda di
 *   progettazione/costruzione/manutenzione di poligoni (tra i cui clienti
 *   figurano anche i Carabinieri), sede reale a Casciana Terme Lari (PI),
 *   non Firenze. L'indirizzo fiorentino nel documento originale era
 *   inventato -- errore individuato dall'utente controllando manualmente
 *   una singola riga, non da una verifica sistematica: le altre 17 righe
 *   "privato" sono state ricontrollate una per una dopo questo episodio e
 *   risultano tutte reali.
 */

export interface CensusRow {
  name: string;
  comune: string;
  provinciaSigla: string;
  regione: string;
  type: RangeType;
  address?: string;
  phone?: string;
  website?: string;
  /** Tag compatto per ranges.data_source. */
  source: string;
}

const TSN_MAIN: [name: string, comune: string, sigla: string, regione: string][] = [
  ['TSN Agrigento', 'Agrigento', 'AG', 'Sicilia'],
  ['TSN Altavilla Milicia', 'Altavilla Milicia', 'PA', 'Sicilia'],
  ['TSN Bagheria', 'Bagheria', 'PA', 'Sicilia'],
  ['TSN Barletta', 'Barletta', 'BT', 'Puglia'],
  ['TSN Breno', 'Breno', 'BS', 'Lombardia'],
  ['TSN Busto Arsizio', 'Busto Arsizio', 'VA', 'Lombardia'],
  ['TSN Caltagirone', 'Caltagirone', 'CT', 'Sicilia'],
  ['TSN Caltanissetta', 'Caltanissetta', 'CL', 'Sicilia'],
  ['TSN Campobasso', 'Campobasso', 'CB', 'Molise'],
  ['TSN Candela', 'Candela', 'FG', 'Puglia'],
  ['TSN Carpi', 'Carpi', 'MO', 'Emilia-Romagna'],
  ['TSN Castellammare di Stabia', 'Castellammare di Stabia', 'NA', 'Campania'],
  ['TSN Castelfranco Emilia', 'Castelfranco Emilia', 'BO', 'Emilia-Romagna'],
  ['TSN Catania', 'Catania', 'CT', 'Sicilia'],
  ['TSN Centuripe', 'Centuripe', 'EN', 'Sicilia'],
  ['TSN Cerea', 'Cerea', 'VR', 'Veneto'],
  ['TSN Chieti', 'Chieti', 'CH', 'Abruzzo'],
  ['TSN Cividale', 'Cividale del Friuli', 'UD', 'Friuli-Venezia Giulia'],
  ['TSN Civitavecchia', 'Civitavecchia', 'RM', 'Lazio'],
  ['TSN Como', 'Como', 'CO', 'Lombardia'],
  ['TSN Crotone', 'Crotone', 'KR', 'Calabria'],
  ['TSN Enna', 'Enna', 'EN', 'Sicilia'],
  ['TSN Este', 'Este', 'PD', 'Veneto'],
  ['TSN Firenze', 'Firenze', 'FI', 'Toscana'],
  ['TSN Gallarate', 'Gallarate', 'VA', 'Lombardia'],
  ['TSN Imola', 'Imola', 'BO', 'Emilia-Romagna'],
  ["TSN L'Aquila", "L'Aquila", 'AQ', 'Abruzzo'],
  ['TSN Lanciano', 'Lanciano', 'CH', 'Abruzzo'],
  ['TSN Livorno', 'Livorno', 'LI', 'Toscana'],
  ['TSN Lucca', 'Lucca', 'LU', 'Toscana'],
  ['TSN Mazara', 'Mazara del Vallo', 'TP', 'Sicilia'],
  ['TSN Messina', 'Messina', 'ME', 'Sicilia'],
  ['TSN Milazzo', 'Milazzo', 'ME', 'Sicilia'],
  ['TSN Milano', 'Milano', 'MI', 'Lombardia'],
  ['TSN Modena', 'Modena', 'MO', 'Emilia-Romagna'],
  ['TSN Napoli', 'Napoli', 'NA', 'Campania'],
  ['TSN Padova', 'Padova', 'PD', 'Veneto'],
  ['TSN Palermo', 'Palermo', 'PA', 'Sicilia'],
  ['TSN Pavia', 'Pavia', 'PV', 'Lombardia'],
  ['TSN Perugia', 'Perugia', 'PG', 'Umbria'],
  ['TSN Pescara', 'Pescara', 'PE', 'Abruzzo'],
  ['TSN Pordenone', 'Pordenone', 'PN', 'Friuli-Venezia Giulia'],
  ['TSN Ragusa', 'Ragusa', 'RG', 'Sicilia'],
  ['TSN Reggio Calabria', 'Reggio Calabria', 'RC', 'Calabria'],
  ['TSN Reggio Emilia', 'Reggio Emilia', 'RE', 'Emilia-Romagna'],
  ['TSN Rho', 'Rho', 'MI', 'Lombardia'],
  ['TSN Roma', 'Roma', 'RM', 'Lazio'],
  ['TSN Siracusa', 'Siracusa', 'SR', 'Sicilia'],
  ['TSN Spoleto', 'Spoleto', 'PG', 'Umbria'],
  ['TSN Sulmona', 'Sulmona', 'AQ', 'Abruzzo'],
  ['TSN Teramo', 'Teramo', 'TE', 'Abruzzo'],
  ['TSN Tolmezzo', 'Tolmezzo', 'UD', 'Friuli-Venezia Giulia'],
  ['TSN Torino', 'Torino', 'TO', 'Piemonte'],
  ['TSN Trapani', 'Trapani', 'TP', 'Sicilia'],
  ['TSN Trieste', 'Trieste', 'TS', 'Friuli-Venezia Giulia'],
  ['TSN Udine', 'Udine', 'UD', 'Friuli-Venezia Giulia'],
  ['TSN Vasto', 'Vasto', 'CH', 'Abruzzo'],
  ['TSN Vercelli', 'Vercelli', 'VC', 'Piemonte'],
];

/**
 * Siti ufficiali verificati a mano (ricerca + fetch diretto della pagina),
 * non dal censimento originale. Popolati incrementalmente: assente qui non
 * significa "senza sito", significa "non ancora verificato".
 */
const TSN_WEBSITES: Record<string, string> = {
  'TSN Milano': 'https://www.tsnmilano.it/',
  'TSN Roma': 'https://tsnroma.it/',
  'TSN Torino': 'https://www.tsntorino.it/',
  'TSN Napoli': 'https://tsnnapoli.it/',
  // Il sito ufficiale (tsnfirenze.it) esiste ma la pagina orari non era
  // raggiungibile in fase di verifica; l'Instagram, confermato dall'utente
  // insieme agli orari, è il canale attivo.
  'TSN Firenze': 'https://www.instagram.com/tsnfirenze/',
  'TSN Catania': 'https://www.tsncatania.it/',
  'TSN Perugia': 'https://www.tsn-perugia.it/',
};

const tsnRows: CensusRow[] = TSN_MAIN.map(([name, comune, sigla, regione]) => ({
  name,
  comune,
  provinciaSigla: sigla,
  regione,
  type: 'tsn' as const,
  source: 'censimento_unasci_2026',
  ...(TSN_WEBSITES[name] ? { website: TSN_WEBSITES[name] } : {}),
}));

/** FITAV e FITDS: solo le voci con comune reale (le altre erano "da verificare"). */
const fitavFitdsRows: CensusRow[] = [
  {
    name: 'Trap Concaverde',
    comune: 'Lonato del Garda',
    provinciaSigla: 'BS',
    regione: 'Lombardia',
    type: 'tiro_a_volo',
    address: 'Loc. Basia',
    phone: '030 99902000',
    website: 'https://trapconcaverde.it/',
    source: 'censimento_fitav_2026',
  },
  {
    name: 'La Folce Poligoni di Tiro',
    comune: 'Magione',
    provinciaSigla: 'PG',
    regione: 'Umbria',
    type: 'dinamico',
    address: 'Via di Caserino 33',
    phone: '347 6951232',
    website: 'https://poligonilafolce.it/',
    source: 'censimento_fitds_2026',
  },
];

/**
 * Poligoni privati/ASD (fonte: mappa Armi e Tiro + ricerche). Esclusi:
 * i duplicati già uniti sopra (Carpi, Trap Concaverde, La Folce), il
 * poligono militare (fuori perimetro) e le righe senza alcun dato utile.
 */
const privateRows: CensusRow[] = [
  {
    name: 'A.S.D. Xiridia Shooting',
    comune: 'Floridia',
    provinciaSigla: 'SR',
    regione: 'Sicilia',
    type: 'privato',
    address: 'S.p. 74',
    phone: '331 3728879',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Il Piancardato',
    comune: 'Collazzone',
    provinciaSigla: 'PG',
    regione: 'Umbria',
    type: 'privato',
    address: 'Gaglietole di Collazzone',
    phone: '320 2307745',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Renato Lamera',
    comune: 'Martinengo',
    provinciaSigla: 'BG',
    regione: 'Lombardia',
    type: 'privato',
    address: 'Via Ponticeli 1',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Sottotiro "Il Poligono"',
    comune: 'Perosa Argentina',
    provinciaSigla: 'TO',
    regione: 'Piemonte',
    type: 'privato',
    address: 'Loc. San Sebastiano 29',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Sport Gun Il Poligono',
    comune: 'San Zenone degli Ezzelini',
    provinciaSigla: 'TV',
    regione: 'Veneto',
    type: 'privato',
    address: 'Via Gobba 9',
    phone: '0423 567639',
    // sportgun.it non risolve (dominio irraggiungibile in fase di verifica);
    // pagina Facebook confermata dall'utente come canale attivo.
    website: 'https://www.facebook.com/profile.php?id=100063769710774',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Tac Madonna del Bosco',
    comune: 'Conselice',
    provinciaSigla: 'RA',
    regione: 'Emilia-Romagna',
    type: 'privato',
    address: 'Via Coronella 110',
    phone: '333 5963039',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Poligono Rocca Massima',
    comune: 'Rocca Massima',
    provinciaSigla: 'LT',
    regione: 'Lazio',
    type: 'privato',
    website: 'https://www.associazionetirostatico.it',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'A.S.D. Accadorza Sedilo',
    comune: 'Sedilo',
    provinciaSigla: 'OR',
    regione: 'Sardegna',
    type: 'privato',
    phone: '393 9448914',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Poligono "Vado La Mola"',
    comune: 'Bassiano',
    provinciaSigla: 'LT',
    regione: 'Lazio',
    type: 'privato',
    address: 'Via Valvisciolo',
    phone: '334 1827470',
    website: 'https://www.vadolamola.it',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Poligono Orobico BG ASD',
    comune: 'Ubiale Clanezzo',
    provinciaSigla: 'BG',
    regione: 'Lombardia',
    type: 'privato',
    address: 'Via delle Valli 28',
    phone: '331 1449657',
    website: 'https://www.poligonoorobico.com',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'T.S.N. Loiano',
    comune: 'Loiano',
    provinciaSigla: 'BO',
    regione: 'Emilia-Romagna',
    type: 'tsn',
    address: 'Via Valsicura 5',
    phone: '051 6544794',
    website: 'https://www.tsnloiano.it',
    source: 'censimento_armietiro_2026',
  },
  {
    // Tenuta distinta da "TSN Carpi" (tabella principale): vedi nota di
    // deduplicazione in testa al file.
    name: 'Tiro a Segno Carpi',
    comune: 'Carpi',
    provinciaSigla: 'MO',
    regione: 'Emilia-Romagna',
    type: 'tsn',
    phone: '059 686848',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Poligono di Arzene',
    comune: 'Arzene',
    provinciaSigla: 'PN',
    regione: 'Friuli-Venezia Giulia',
    type: 'privato',
    address: 'Via Grava 454',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'ASD Freeshots',
    // Scoglitti è una frazione costiera del comune di Vittoria, non un
    // comune a sé: usato il comune amministrativo reale per la geocodifica,
    // la frazione resta nell'indirizzo.
    comune: 'Vittoria',
    provinciaSigla: 'RG',
    regione: 'Sicilia',
    type: 'privato',
    address: 'Via dei Scoglitti, Scoglitti',
    phone: '333 2068161',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Lince Poligono di Tiro ASD',
    comune: 'Guastalla',
    provinciaSigla: 'RE',
    regione: 'Emilia-Romagna',
    type: 'privato',
    address: 'Via Bosco',
    website: 'https://www.asdlince.it',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Tiro a Segno Vidracco',
    comune: 'Vidracco',
    provinciaSigla: 'TO',
    regione: 'Piemonte',
    type: 'tsn',
    address: 'Via Carpineto 5',
    phone: '338 6271804',
    website: 'https://www.tirovidracco.it',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Poligono Torre Baccelli',
    comune: 'Fara in Sabina',
    provinciaSigla: 'RI',
    regione: 'Lazio',
    type: 'privato',
    address: 'Via Pantanella',
    phone: '334 8905531',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Conrad Shooting Club',
    comune: 'Casei Gerola',
    provinciaSigla: 'PV',
    regione: 'Lombardia',
    type: 'privato',
    website: 'https://www.conradshootingclub.it/',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'S.I.D. Shooting Combat School',
    comune: 'Milano',
    provinciaSigla: 'MI',
    regione: 'Lombardia',
    type: 'privato',
    source: 'censimento_armietiro_2026',
  },
  {
    name: 'Poligono della Galleria',
    comune: 'Lograto',
    provinciaSigla: 'BS',
    regione: 'Lombardia',
    type: 'privato',
    address: 'Via Crocefisso 1',
    source: 'censimento_armietiro_2026',
  },
];

export const CENSUS_ROWS: CensusRow[] = [...tsnRows, ...fitavFitdsRows, ...privateRows];

/** Verifica a import-time che ogni sigla usata sia nella tabella di conversione. */
for (const row of CENSUS_ROWS) {
  provinciaFromSigla(row.provinciaSigla);
}
