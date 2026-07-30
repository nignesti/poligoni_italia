/**
 * Sigle provinciali italiane usate nel censimento (seed/census-2026-07.ts).
 *
 * Nomenclatura ISTAT standard, dato pubblico stabile: non contiene alcuna
 * informazione su singole strutture, solo il nome per esteso di ciascuna
 * provincia a partire dalla sigla. Limitata alle sigle effettivamente usate
 * nel censimento, non l'elenco nazionale completo.
 */
export const PROVINCIA_BY_SIGLA: Record<string, string> = {
  AG: 'Agrigento',
  AQ: "L'Aquila",
  BG: 'Bergamo',
  BO: 'Bologna',
  BS: 'Brescia',
  BT: 'Barletta-Andria-Trani',
  CB: 'Campobasso',
  CH: 'Chieti',
  CL: 'Caltanissetta',
  CO: 'Como',
  CT: 'Catania',
  EN: 'Enna',
  FG: 'Foggia',
  FI: 'Firenze',
  KR: 'Crotone',
  LI: 'Livorno',
  LT: 'Latina',
  LU: 'Lucca',
  ME: 'Messina',
  MI: 'Milano',
  MO: 'Modena',
  NA: 'Napoli',
  OR: 'Oristano',
  PA: 'Palermo',
  PD: 'Padova',
  PE: 'Pescara',
  PG: 'Perugia',
  PN: 'Pordenone',
  PV: 'Pavia',
  RA: 'Ravenna',
  RI: 'Rieti',
  RC: 'Reggio Calabria',
  RE: 'Reggio Emilia',
  RG: 'Ragusa',
  RM: 'Roma',
  SR: 'Siracusa',
  TE: 'Teramo',
  TO: 'Torino',
  TP: 'Trapani',
  TS: 'Trieste',
  TV: 'Treviso',
  UD: 'Udine',
  VA: 'Varese',
  VC: 'Vercelli',
  VR: 'Verona',
};

export function provinciaFromSigla(sigla: string): string {
  const name = PROVINCIA_BY_SIGLA[sigla.toUpperCase()];
  if (!name) {
    throw new Error(`provinciaFromSigla: sigla sconosciuta "${sigla}". Aggiungerla alla tabella.`);
  }
  return name;
}
