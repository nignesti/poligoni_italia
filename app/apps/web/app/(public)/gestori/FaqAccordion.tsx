'use client';

import { useState } from 'react';
import { Plus } from '@phosphor-icons/react/ssr';

const FAQS = [
  {
    question: 'Devo abbandonare il mio gestionale attuale?',
    answer:
      'No. Poligoni Italia si affianca al software che usi già (GESTIT, T.A.R.G.E.T. o altro): nessun vincolo di esclusiva, nessuna migrazione forzata.',
  },
  {
    question: 'Quanto costa iniziare?',
    answer:
      'Il piano Base è gratuito: scheda struttura pubblica, gestione orari e chiusure, richieste di disponibilità fino a 3 linee. Si passa a Partner o Premium solo se serve di più.',
  },
  {
    question: 'Come arrivano le richieste dei tiratori?',
    answer:
      'I tiratori ti trovano tramite le pagine di ricerca e la scheda struttura, poi inviano una richiesta di disponibilità che ricevi direttamente in dashboard.',
  },
  {
    question: 'Come aggiungo la mia struttura?',
    answer:
      'Con "Aggiungi la tua struttura" rivendichi la scheda della tua struttura e la pubblichi con orari e informazioni di base in pochi minuti.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={faq.question}
            className={`overflow-hidden rounded-panel border bg-surface transition-colors ${
              isOpen ? 'border-accent' : 'border-hairline'
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-medium text-ink">{faq.question}</span>
              <Plus
                size={18}
                className={`shrink-0 text-accent transition-transform ${isOpen ? 'rotate-45' : ''}`}
                aria-hidden
              />
            </button>
            {isOpen && (
              <p className="px-6 pb-5 text-sm leading-relaxed text-ink-muted">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
