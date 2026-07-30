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
  'limiti-munizioni': {
    slug: 'limiti-munizioni',
    title: 'Limiti di detenzione munizioni: art. 97 TULPS',
    description:
      'Guida ai limiti di detenzione delle munizioni secondo l’articolo 97 del TULPS. Categorie, quantità massime e obblighi di denuncia.',
    content: [
      'L’articolo 97 del Testo Unico delle Leggi di Pubblica Sicurezza (TULPS, R.D. 18 giugno 1931, n. 773) stabilisce i limiti massimi di munizioni che un privato cittadino può detenere senza licenza della Prefettura.',
      '## Le quattro categorie',
      'La legge distingue quattro categorie di munizioni con limiti diversi:',
      '- **Armi corte**: fino a 200 cartucce per tutte le armi corte detenute (la somma, non per calibro);',
      '- **Armi lunghe da caccia**: fino a 1.500 cartucce a palla;',
      '- **Spezzone (pallini)**: fino a 1.500 cartucce, con obbligo di denuncia oltre 1.000 pezzi;',
      '- **Polvere da sparo**: fino a 2.000 grammi.',
      '## L’errore più comune',
      'Il limite si applica per **categoria**, non per calibro. Se possiedi una pistola 9x21 e una .45 ACP, il limite di 200 cartucce per arma corta è unico: la somma delle munizioni per entrambi i calibri non deve superare 200 pezzi. Superarlo senza licenza della Prefettura è reato.',
      '## Obbligo di denuncia',
      'Per lo spezzone, scatta l’obbligo di denuncia alla locale Autorità di Pubblica Sicurezza quando si detengono più di 1.000 pezzi. La denuncia è un atto formale, non una richiesta di autorizzazione.',
      '## Cosa fare se si supera il limite',
      'Chi detiene quantità eccedenti deve richiedere alla Prefettura competente una licenza che autorizzi la detenzione eccedentaria. In assenza di questa licenza, l’eccedenza configura il reato di detenzione abusiva di munizioni.',
    ],
  },
};

export function allGuides(): Guide[] {
  return Object.values(GUIDES);
}
