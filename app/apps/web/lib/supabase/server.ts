/**
 * Client Supabase per Server Component, Route Handler e middleware.
 * Legge/scrive i cookie di sessione — vedi middleware.ts per il refresh
 * automatico a ogni richiesta (pattern ufficiale @supabase/ssr per Next.js
 * App Router).
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll chiamato da un Server Component: ignorabile se il
            // middleware si occupa già del refresh sessione.
          }
        },
      },
    },
  );
}
