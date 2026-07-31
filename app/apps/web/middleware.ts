import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Applica a tutte le rotte tranne asset statici e immagini — il refresh
     * sessione deve girare su ogni richiesta di pagina, non solo /gestore,
     * altrimenti il cookie scade silenziosamente anche fuori da quelle rotte.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
