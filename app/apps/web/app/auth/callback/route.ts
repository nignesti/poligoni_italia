/**
 * Callback OAuth (Google): Supabase reindirizza qui con un `code` da
 * scambiare per una sessione. Usata solo dal flusso Google — l'OTP email
 * si verifica lato client con verifyOtp, senza redirect.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/gestore';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/gestore/login?error=auth_failed`);
}
