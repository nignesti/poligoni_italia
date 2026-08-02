'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/gestore/login');
    router.refresh();
  };

  return (
    <button type="button" onClick={handleLogout} className="hover:text-ink">
      Esci
    </button>
  );
}
