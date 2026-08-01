import nextConfig from "eslint-config-next";

// "BOZZA REDESIGN/" è materiale di riferimento Replit (mockup, non fa parte
// dell'app): niente config propria, quindi finiva incluso dagli scan di
// default di eslint-config-next. Stesso motivo dell'exclude in tsconfig.json.
export default [
  { ignores: ["BOZZA REDESIGN/**"] },
  ...nextConfig,
];
