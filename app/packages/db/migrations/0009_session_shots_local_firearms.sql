-- Armeria, munizioni e documenti diventano dati solo-locali sul dispositivo
-- dell'utente: l'app non scrive più né legge le tabelle firearms,
-- ammo_movements, user_documents (restano nello schema per compatibilità
-- storica di eventuali righe già esistenti, ma non ricevono più nuove
-- scritture dal client).
--
-- session_shots.firearm_id perde il vincolo NOT NULL: l'arma non è più
-- garantita esistere lato server. firearm_label conserva il nome dell'arma
-- inserito localmente al momento della sessione.
ALTER TABLE "session_shots" ALTER COLUMN "firearm_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "session_shots" ADD COLUMN "firearm_label" text;
