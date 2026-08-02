/**
 * Refresh della sessione Supabase a ogni richiesta (pattern ufficiale
 * @supabase/ssr) + gate delle rotte gestore e admin: senza sessione,
 * redirect a /gestore/login prima ancora che la pagina venga renderizzata.
 *
 * /admin ha un secondo livello di gate oltre alla sessione: l'email deve
 * comparire in ADMIN_EMAILS. A differenza di /gestore (dove l'autorizzazione
 * sulla singola struttura è verificata pagina per pagina via
 * range_managers), qui la scrittura passa da Drizzle con accesso pieno alla
 * tabella `ranges` — nessuna RLS di mezzo — quindi il controllo email è
 * l'unica barriera e va ripetuto anche lato server action (vedi
 * app/(admin)/admin/actions.ts), non solo qui.
 */
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const GESTORE_PUBLIC_PATHS = ['/gestore/login', '/gestore/rivendica'];

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // IMPORTANTE: getUser(), non getSession(). getSession() legge solo il
  // cookie senza verificarlo col server Supabase — un cookie manomesso
  // passerebbe. getUser() lo rivalida a ogni richiesta.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isGestoreRoute = pathname.startsWith('/gestore');
  const isPublicGestorePath = GESTORE_PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (isGestoreRoute && !isPublicGestorePath && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/gestore/login';
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith('/admin')) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/gestore/login';
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    const email = (user.email ?? '').toLowerCase();
    if (!adminEmails().includes(email)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.search = '';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}
