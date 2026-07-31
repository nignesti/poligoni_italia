-- Row Level Security (Piano_Sviluppo_App.md §8.1 regola 6, §8.3).
--
-- Mai attivata finora: fino a questa migrazione nessuna rotta usava
-- Supabase Auth, quindi auth.uid() sarebbe sempre stato NULL e ogni
-- policy avrebbe bloccato tutto. Ora che l'autenticazione esiste
-- (0007_auth_sync_trigger.sql + il client Supabase in app e sito),
-- attivarla.
--
-- Principio: il diario (sessions, firearms, ammo_movements, targets,
-- gpg_logbook, documenti) è privato dell'utente — nessuna policy dà al
-- gestore accesso a queste tabelle, punto (Piano §8.3).

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "users_own" ON "users"
  FOR SELECT USING (id = auth.uid());--> statement-breakpoint
CREATE POLICY "users_own_update" ON "users"
  FOR UPDATE USING (id = auth.uid());--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- Documenti scadenziali
-- ---------------------------------------------------------------------------
ALTER TABLE "user_documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "user_documents_own" ON "user_documents"
  USING (user_id = auth.uid());--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- Diario — sessioni, armi, munizioni, bersagli
-- ---------------------------------------------------------------------------
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "sessions_own" ON "sessions"
  USING (user_id = auth.uid());--> statement-breakpoint

ALTER TABLE "session_shots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "session_shots_own" ON "session_shots"
  USING (session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid()));--> statement-breakpoint

ALTER TABLE "firearms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "firearms_own" ON "firearms"
  USING (user_id = auth.uid());--> statement-breakpoint

ALTER TABLE "maintenance_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "maintenance_rules_own" ON "maintenance_rules"
  USING (firearm_id IN (SELECT id FROM firearms WHERE user_id = auth.uid()));--> statement-breakpoint

ALTER TABLE "targets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "targets_own" ON "targets"
  USING (session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid()));--> statement-breakpoint

ALTER TABLE "target_holes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "target_holes_own" ON "target_holes"
  USING (target_id IN (
    SELECT t.id FROM targets t
    JOIN sessions s ON s.id = t.session_id
    WHERE s.user_id = auth.uid()
  ));--> statement-breakpoint

ALTER TABLE "ammo_movements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "ammo_movements_own" ON "ammo_movements"
  USING (user_id = auth.uid());--> statement-breakpoint

ALTER TABLE "gpg_logbook" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "gpg_logbook_own" ON "gpg_logbook"
  USING (user_id = auth.uid());--> statement-breakpoint

ALTER TABLE "gpg_exercises" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "gpg_exercises_own" ON "gpg_exercises"
  USING (logbook_id IN (SELECT id FROM gpg_logbook WHERE user_id = auth.uid()));--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- Pass Pro (abbonamento del tiratore)
-- ---------------------------------------------------------------------------
ALTER TABLE "user_subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "user_subscriptions_own" ON "user_subscriptions"
  USING (user_id = auth.uid());--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- Prenotazioni — il tiratore vede le proprie, il gestore quelle della
-- propria struttura. Due policy sulla stessa tabella: Postgres le unisce
-- in OR per il SELECT.
-- ---------------------------------------------------------------------------
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "bookings_own" ON "bookings"
  USING (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "bookings_manager" ON "bookings"
  USING (range_id IN (SELECT range_id FROM range_managers WHERE user_id = auth.uid()));--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- Richieste di disponibilità — chiunque può inviarne una (form pubblico,
-- anche senza autenticazione), ma solo il gestore della struttura può
-- leggerle: contengono email e telefono del richiedente.
-- ---------------------------------------------------------------------------
ALTER TABLE "booking_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "booking_requests_insert_public" ON "booking_requests"
  FOR INSERT WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "booking_requests_select_manager" ON "booking_requests"
  FOR SELECT USING (range_id IN (SELECT range_id FROM range_managers WHERE user_id = auth.uid()));--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- Gestori — un gestore vede le proprie righe di gestione (quali strutture
-- gestisce), non l'elenco di chi gestisce le altrui.
-- ---------------------------------------------------------------------------
ALTER TABLE "range_managers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "range_managers_own" ON "range_managers"
  FOR SELECT USING (user_id = auth.uid());--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- SaaS Pro (fatturazione del gestore) — tutto scopato tramite range_managers.
-- ---------------------------------------------------------------------------
ALTER TABLE "manager_billing_config" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "manager_billing_config_own" ON "manager_billing_config"
  USING (user_id = auth.uid());--> statement-breakpoint

ALTER TABLE "range_subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "range_subscriptions_manager" ON "range_subscriptions"
  USING (range_id IN (SELECT range_id FROM range_managers WHERE user_id = auth.uid()));--> statement-breakpoint

ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "invoices_manager" ON "invoices"
  USING (range_subscription_id IN (
    SELECT rs.id FROM range_subscriptions rs
    JOIN range_managers rm ON rm.range_id = rs.range_id
    WHERE rm.user_id = auth.uid()
  ));--> statement-breakpoint

ALTER TABLE "billing_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "billing_history_manager" ON "billing_history"
  USING (range_subscription_id IN (
    SELECT rs.id FROM range_subscriptions rs
    JOIN range_managers rm ON rm.range_id = rs.range_id
    WHERE rm.user_id = auth.uid()
  ));--> statement-breakpoint
