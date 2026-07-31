/**
 * Refresh della sessione Supabase a ogni richiesta (pattern ufficiale
 * @supabase/ssr) + gate delle rotte gestore: senza sessione, redirect a
 * /gestore/login prima ancora che la pagina venga renderizzata.
 */
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const GESTORE_PUBLIC_PATHS = ['/gestore/login', '/gestore/rivendica'];

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

  return response;
}
