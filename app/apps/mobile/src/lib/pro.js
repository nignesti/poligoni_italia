/**
 * Stato abbonamento Pro lato tiratore. Non esiste ancora un piano Pro reale
 * per i tiratori: il billing attuale (packages/core/billing) copre solo i
 * gestori. Per ora il gate sulle funzioni Pro (es. Cronografo) è solo
 * visivo — quando esisterà un vero abbonamento a pagamento, questa funzione
 * andrà sostituita con una verifica reale dello stato sottoscrizione.
 */

const KEY = 'poligoni_italia:pro';

export function isProUnlocked() {
  return localStorage.getItem(KEY) === 'true';
}
