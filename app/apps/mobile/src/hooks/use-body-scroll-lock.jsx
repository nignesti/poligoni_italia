import { useEffect } from "react";

/**
 * Blocca lo scroll della pagina sotto mentre un modale bottom-sheet è
 * aperto. Senza questo, su Safari iOS un gesto di scroll che parte sul
 * modale può "sfondare" e scorrere la pagina dietro invece del contenuto
 * del modale — bug osservato su dispositivo reale.
 */
export function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}
