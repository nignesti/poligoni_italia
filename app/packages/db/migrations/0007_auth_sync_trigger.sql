-- Sincronizza auth.users (gestito da Supabase Auth) con public.users
-- (Piano_Sviluppo_App.md §7.3 task 13, §4.2 — "l'autenticazione primaria è
-- gestita da Supabase Auth, questa tabella contiene i profili").
--
-- SECURITY DEFINER: la funzione gira coi permessi di chi l'ha creata (il
-- ruolo di migrazione), non del chiamante — necessario perché scrive su
-- public.users da un trigger su una tabella di uno schema diverso (auth)
-- su cui il ruolo authenticated non ha privilegi diretti.
--
-- ON CONFLICT DO NOTHING: se una riga public.users con lo stesso id esiste
-- già (caso raro: dato storico o retry), non la sovrascrive.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--> statement-breakpoint

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
