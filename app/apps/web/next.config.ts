import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

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
