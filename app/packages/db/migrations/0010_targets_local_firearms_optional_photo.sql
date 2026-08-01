-- Bersagli: firearm_id perde il vincolo NOT NULL (stesso motivo di
-- session_shots, migrazione 0009 — l'armeria è dato solo-locale) e
-- storage_ref diventa opzionale (la marcatura fori v1 non richiede una foto
-- caricata, solo un diagramma marcato dall'utente).
ALTER TABLE "targets" ALTER COLUMN "firearm_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "targets" ALTER COLUMN "storage_ref" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "targets" ADD COLUMN "firearm_label" text;
