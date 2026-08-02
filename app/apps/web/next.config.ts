import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Il Router Cache lato client tiene le pagine statiche (/poligoni/...) in
  // cache 5 minuti (default Next.js) anche quando revalidatePath ha già
  // rigenerato il server: chi clicca un link nel sito vede dati vecchi fino
  // a scadenza cache, anche se un hard refresh mostra già quelli nuovi.
  // A 0 ogni navigazione va a riprendere il payload fresco dal server —
  // scambio voluto: un po' di round-trip in più per modifiche sempre visibili.
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },

  /** I workspace packages (TypeScript) devono essere trasferiti da Next.js. */
  transpilePackages: [
    '@poligoni/core',
    '@poligoni/ui',
    '@poligoni/schemas',
    '@poligoni/db',
  ],

  webpack: (config) => {
    // I workspace packages usano `verbatimModuleSyntax` e importano con
    // estensione `.js`. Webpack deve sapere che `.js` può essere `.ts`.
    if (config.resolve) {
      config.resolve.extensionAlias = {
        '.js': ['.ts', '.tsx', '.js', '.jsx'],
        '.mjs': ['.mts', '.mjs'],
      };
    }
    return config;
  },
};

export default nextConfig;
