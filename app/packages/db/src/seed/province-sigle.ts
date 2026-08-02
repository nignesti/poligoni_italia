/**
 * Sigle provinciali italiane (targa), nomenclatura ISTAT standard.
 *
 * Dato pubblico stabile: non contiene alcuna informazione su singole
 * strutture, solo il nome per esteso di ciascuna provincia a partire dalla
 * sigla. Elenco completo delle 107 province italiane.
 *
 * Le 4 sigle sarde storiche VS/CI/OG/OT (istituite nel 2005, poi confluite
 * in "Sud Sardegna" nel 2016, sigle ancora usate dal dataset comuni ISTAT
 * importato in comuni.ts) sono state riverificate il 03/08/2026: dal 2025
 * (LR 7/2021) la Sardegna è tornata a sei province e "Sud Sardegna" è stata
 * abolita — VS/CI/OG/OT mappano di nuovo sulle rispettive province attuali
 * (Medio Campidano, Sulcis Iglesiente, Ogliastra, Gallura Nord-Est
 * Sardegna), non più su un unico nome ombrello. Fonti: pagine ufficiali dei
 * comuni per provincia (tuttitalia.it) incrociate con le 101 righe già
 * presenti in comuni.ts — unico scarto Teulada (SU generico nel dataset
 * originale), confermato passato a Sulcis Iglesiente.
 *
 * La sigla SU (usata storicamente per "Sud Sardegna" stessa, non per una
 * delle 4 mini-province) è stata rimossa apposta: la provincia non esiste
 * più e i suoi comuni sono stati redistribuiti su tre province diverse
 * (Sulcis Iglesiente, Medio Campidano, Cagliari) — nessun singolo nome può
 * sostituirla senza sapere quale comune specifico porta quella sigla, quindi
 * meglio un errore esplicito in provinciaFromSigla() che un valore silenziosamente
 * sbagliato.
 *
 * Usato anche per normalizzare province scritte come sigla da fonti
 * importate (es. Targetfun, vedi TARGETFUN_IMPORT_LOG.md) in
 * queries/ranges.ts.
 */
export const PROVINCIA_BY_SIGLA: Record<string, string> = {
  AG: 'Agrigento',
  AL: 'Alessandria',
  AN: 'Ancona',
  AO: 'Aosta',
  AP: 'Ascoli Piceno',
  AQ: "L'Aquila",
  AR: 'Arezzo',
  AT: 'Asti',
  AV: 'Avellino',
  BA: 'Bari',
  BG: 'Bergamo',
  BI: 'Biella',
  BL: 'Belluno',
  BN: 'Benevento',
  BO: 'Bologna',
  BR: 'Brindisi',
  BS: 'Brescia',
  BT: 'Barletta-Andria-Trani',
  BZ: 'Bolzano',
  CA: 'Cagliari',
  CB: 'Campobasso',
  CE: 'Caserta',
  CH: 'Chieti',
  CI: 'Sulcis Iglesiente',
  CL: 'Caltanissetta',
  CN: 'Cuneo',
  CO: 'Como',
  CR: 'Cremona',
  CS: 'Cosenza',
  CT: 'Catania',
  CZ: 'Catanzaro',
  EN: 'Enna',
  FC: 'Forlì-Cesena',
  FE: 'Ferrara',
  FG: 'Foggia',
  FI: 'Firenze',
  FM: 'Fermo',
  FR: 'Frosinone',
  GE: 'Genova',
  GO: 'Gorizia',
  GR: 'Grosseto',
  IM: 'Imperia',
  IS: 'Isernia',
  KR: 'Crotone',
  LC: 'Lecco',
  LE: 'Lecce',
  LI: 'Livorno',
  LO: 'Lodi',
  LT: 'Latina',
  LU: 'Lucca',
  MB: 'Monza e della Brianza',
  MC: 'Macerata',
  ME: 'Messina',
  MI: 'Milano',
  MN: 'Mantova',
  MO: 'Modena',
  MS: 'Massa-Carrara',
  MT: 'Matera',
  NA: 'Napoli',
  NO: 'Novara',
  NU: 'Nuoro',
  OG: 'Ogliastra',
  OR: 'Oristano',
  OT: 'Gallura Nord-Est Sardegna',
  PA: 'Palermo',
  PC: 'Piacenza',
  PD: 'Padova',
  PE: 'Pescara',
  PG: 'Perugia',
  PI: 'Pisa',
  PN: 'Pordenone',
  PO: 'Prato',
  PR: 'Parma',
  PT: 'Pistoia',
  PU: 'Pesaro e Urbino',
  PV: 'Pavia',
  PZ: 'Potenza',
  RA: 'Ravenna',
  RC: 'Reggio Calabria',
  RE: 'Reggio Emilia',
  RG: 'Ragusa',
  RI: 'Rieti',
  RM: 'Roma',
  RN: 'Rimini',
  RO: 'Rovigo',
  SA: 'Salerno',
  SI: 'Siena',
  SO: 'Sondrio',
  SP: 'La Spezia',
  SR: 'Siracusa',
  SS: 'Sassari',
  SV: 'Savona',
  TA: 'Taranto',
  TE: 'Teramo',
  TN: 'Trento',
  TO: 'Torino',
  TP: 'Trapani',
  TR: 'Terni',
  TS: 'Trieste',
  TV: 'Treviso',
  UD: 'Udine',
  VA: 'Varese',
  VB: 'Verbano-Cusio-Ossola',
  VC: 'Vercelli',
  VE: 'Venezia',
  VI: 'Vicenza',
  VR: 'Verona',
  VS: 'Medio Campidano',
  VT: 'Viterbo',
  VV: 'Vibo Valentia',
};

export function provinciaFromSigla(sigla: string): string {
  const name = PROVINCIA_BY_SIGLA[sigla.toUpperCase()];
  if (!name) {
    throw new Error(`provinciaFromSigla: sigla sconosciuta "${sigla}". Aggiungerla alla tabella.`);
  }
  return name;
}
